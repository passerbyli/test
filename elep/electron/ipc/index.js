const { shell, app, dialog } = require('electron')
const registerAuthIpc = require('./authIpc')
const registerConfigIpc = require('./configIpc')
const registerDataSourceIpc = require('./dataSourceIpc')
const { exec } = require('child_process')
const { getConfig, getBasePath } = require('../db/configDb')
const consoleUtil = require('../utils/consoleLogUtil')
const path = require('node:path')
const fs = require('node:fs')
const { getVersion } = require('../utils/requestUtil')
const { CronJob } = require('../../plugins/cron/cronUtil')
const { mainSendToRender } = require('../utils/mainSendToRender')
function registerAllIpc(ipcMain) {
  registerAuthIpc(ipcMain)
  registerConfigIpc(ipcMain)
  registerDataSourceIpc(ipcMain)
  console.log('[IPC] 所有 IPC handler 已注册完成')
}

async function ipcHandle(e, args) {
  if (!args || !args.event) {
    return
  }

  const event = args.event
  const params = args.params
  let data
  if (event == 'openChrome') {
    openChrome(params)
  } else if (event == 'openDirectory') {
    data = await openDirectory(params.path, params.type)
  } else if (event == 'select-folder') {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    data = canceled ? null : filePaths // 返回绝对路径
  } else if (event == 'readLogTable') {
    data = await readLogFile(params)
  } else if (event == 'appInfo') {
    job()
    data = {
      version: app.getVersion(),
    }
  } else if (event == 'init') {
  } else if (event == 'selectFile') {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: '选择 SQL 或 JSON 文件',
      filters: [{ name: 'SQL/JSON', extensions: ['sql', 'json'] }],
      properties: ['openFile'],
    })
    if (canceled) return null
    const filePath = filePaths[0]
    const content = fs.readFileSync(filePath, 'utf-8')
    data = { filePath, content }
  }
  return data
}

function openChrome(params) {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  // const chromePath = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`
  const targetUrl = params
  const profile = 'Default'

  exec(`"${chromePath}" --profile-directory="${profile}" "${targetUrl}"`, (error) => {
    if (error) {
      console.error('打开失败:', error)
    } else {
      console.log('Chrome 已打开')
    }
  })
}

function readLogFile(params) {
  const logPath = path.join(getBasePath(), 'logs', `request_${params}.log`)
  if (!fs.existsSync(logPath)) {
    return { success: false, message: '日志文件不存在', data: [] }
  }

  const raw = fs.readFileSync(logPath, 'utf-8')
  const blocks = raw.split(/\n(?=\[\d{4}-\d{2}-\d{2}T)/g)
  const data = []

  for (const block of blocks) {
    const lines = block.trim().split('\n')
    const metaLine = lines[0] || ''
    const typeMatch = metaLine.match(/\] (.+?)(?: \[(.+?)\])?$/)
    const timeMatch = metaLine.match(/^\[(.+?)\]/)

    const type = typeMatch?.[1] || ''
    const tag = typeMatch?.[2] || ''
    const time = timeMatch?.[1] || ''
    let method = '',
      url = '',
      status = '',
      duration = '',
      error = ''
    let params = '',
      requestData = '',
      responseData = ''

    for (let line of lines) {
      line = line.trim()
      if (line.startsWith('URL:')) {
        const parts = line.replace('URL:', '').trim().split(' ')
        method = parts[0]
        url = parts[1]
      } else if (line.startsWith('Params:')) {
        params = line.replace('Params:', '').trim()
      } else if (line.startsWith('Data:')) {
        requestData = line.replace('Data:', '').trim()
      } else if (line.startsWith('Response:')) {
        responseData = line.replace('Response:', '').trim()
      } else if (line.startsWith('Status:')) {
        status = line.replace('Status:', '').trim()
      } else if (line.startsWith('Duration:')) {
        duration = line.replace('Duration:', '').trim()
      } else if (line.startsWith('Error:')) {
        error = line.replace('Error:', '').trim()
      }
    }

    data.push({
      time,
      type,
      tag,
      method,
      url,
      status,
      duration,
      error,
      params,
      requestData,
      responseData,
    })
  }
  return { success: true, data: data }
}

function openDirectory(dirPath, type) {
  let folderPath = dirPath
  if (type === 'config') {
    folderPath = path.join(app.getPath('userData'))
  } else if (type === 'log') {
    folderPath = path.join(getBasePath(), 'logs')
  } else if (type === 'export') {
    folderPath = path.join(getBasePath(), 'export')
  }

  folderPath = getDirectoryFromPath(folderPath)
  if (!fs.existsSync(folderPath)) {
    fs.mkdir(folderPath, { recursive: true }, (error) => {
      if (error) {
        console.log('Error creating directory', error)
      } else {
        console.log('Directory created successfully')
      }
    })
  }

  shell
    .openPath(folderPath)
    .then(() => {
      consoleUtil.log('文件夹已打开')
    })
    .catch((err) => {
      consoleUtil.error('无法打开文件夹:', err)
    })
}

/**
 * 如果是文件则返回其所在目录；如果是目录则原样返回；不存在则返回 null
 * @param {string} targetPath
 * @returns {string|null}
 */
function getDirectoryFromPath(targetPath) {
  if (!fs.existsSync(targetPath)) return null

  const stat = fs.statSync(targetPath)

  if (stat.isFile()) {
    return path.dirname(targetPath)
  } else if (stat.isDirectory()) {
    return targetPath
  } else {
    return null
  }
}

const jobTask = new CronJob('updateJob')

function job() {
  const cron = '0 0 8 * * *' //每天8点执行一次
  jobTask.setExpression(cron)
  jobTask.setCallback(() => {
    getVersion().then((res) => {
      console.log(res.version, app.getVersion())
      if (compareVersion(res.version, app.getVersion()) == 1) {
        mainSendToRender('appNewVersion', res)
      }
    })
  })
  jobTask.start()
}

function compareVersion(v1, v2) {
  const arr1 = v1.split('.').map(Number)
  const arr2 = v2.split('.').map(Number)
  const len = Math.max(arr1.length, arr2.length)

  for (let i = 0; i < len; i++) {
    const n1 = arr1[i] || 0
    const n2 = arr2[i] || 0
    if (n1 > n2) return 1
    if (n1 < n2) return -1
  }
  return 0
}
module.exports = { registerAllIpc, ipcHandle }
