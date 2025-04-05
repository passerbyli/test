const { getUserDataProperty, setUserDataJsonProperty, getBasePath } = require('./utils/storeUtil')

const { shell, app, dialog } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const db = require('./utils/db')
// const { getToBid } = require('./index')
const { login, getMessage } = require('./utils/request')
const consoleUtil = require('./utils/consoleLogUtil')
const { main } = require('../plugins/sqlParse/sqlParse2')

async function ipcHandle(e, args) {
  if (!args || !args.event) {
    return
  }
  const event = args.event
  const params = args.params
  let data
  if (event === 'getUserDataProperty') {
    data = getUserDataProperty(params)
  } else if (event === 'setUserDataJsonProperty') {
    setUserDataJsonProperty(params.key, params.value)
  } else if (event === 'openDirectory') {
    data = await openDirectory(params.path, params.type)
  } else if (event === 'getDataBases') {
    data = await db.getDatabases()
  } else if (event === 'getTables') {
    data = await db.getTables(params.database)
  } else if (event === 'getTableData') {
    data = await db.getTableData(params.database, params.table)
  } else if (event === 'getRoutines') {
    data = await db.getRoutines(params.database)
  } else if (event === 'getProcedureDefinition') {
    data = await db.getProcedureDefinition(params.database, params.procName)
  } else if (event === 'login') {
    data = await login(params.username, params.password)
  } else if (event === 'startBid') {
    // getToBid(params)
  } else if (event == 'getMessage') {
    data = await getMessage()
  } else if (event == 'select-folder') {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
    data = canceled ? null : filePaths // 返回绝对路径
  } else if (event == 'data-lineage-analysis') {
    data = await main(
      params,
      path.join(getUserDataProperty('settings.config.basePath'), 'export/test'),
    )
  } else if (event === 'read-log') {
    try {
      const filePath = getLogPath(params)
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        return { success: true, content }
      } else {
        return { success: false, message: '日志文件不存在' }
      }
    } catch (err) {
      return { success: false, message: err.message }
    }
  } else if (event === 'read-log-table') {
    const logPath = path.join(getBasePath(), 'logs', `request_${params}.log`)
    if (!fs.existsSync(logPath)) {
      return { success: false, message: '日志文件不存在' }
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

    return { success: true, data }
  }
  console.log('ipcHandle', event, params)
  return data
}
// 获取日志目录
const getLogPath = (dateStr) => {
  const fileName = `request_${dateStr}.log`
  const logDir = path.join(getBasePath(), 'logs')
  return path.join(logDir, fileName)
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

async function openDirectory(dirPath, type) {
  let settingConfig = await getUserDataProperty('settings')
  let folderPath = dirPath
  if (type === 'config') {
    folderPath = path.join(app.getPath('userData'))
  } else if (type === 'log') {
    folderPath = path.join(settingConfig.config.basePath, 'log')
  } else if (type === 'export') {
    folderPath = path.join(settingConfig.config.basePath, 'export')
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

module.exports = { ipcHandle }
