const {
  getUserDataProperty,
  setUserDataJsonProperty,
  getBasePath,
  setValueByPath,
} = require('./utils/storeUtil')

const { shell, app, dialog } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const db = require('./utils/db')
// const { getToBid } = require('./index')
const { getMessage, getUserInfo, queryKg } = require('./utils/request')
const consoleUtil = require('./utils/consoleLogUtil')
const { main } = require('../plugins/sqlParse/sqlParse')
const { CronJob } = require('../plugins/cron/cronUtil')
const { mainSendToRender } = require('./utils/mainProcessMsgHandle')
const { createDBClient } = require('../plugins/dbService')

const store = require('../store')
const { loginHeader } = require('./handlers/authHandler')

let dbclient = null
let datas = store.getValue('config', 'datasources')

function getDataBases(db) {
  let aa = {}

  datas.forEach((it) => {
    if (it.name === db) {
      aa = it
    }
  })
  console.log(aa)
  return aa
}

async function ipcHandle(e, args) {
  if (!args || !args.event) {
    return
  }
  if (dbclient == null) {
    dbclient = await createDBClient(getDataBases('pgsql_name'))
  }

  const event = args.event
  const params = args.params
  let data
  if (event == 'readG6Data') {
    data = await JSON.parse(
      fs.readFileSync(
        '/Users/lihaomin/projects/GitHub/test/ele_plus/plugins/sqlParse/sql_analysis_result.json',
        'utf-8',
      ),
    )
  } else if (event == 'kg') {
    data = await queryKg(params)
  } else if (event === 'getDBQuery') {
    data = await dbclient.getDBQuery(params.sql)
  } else if (event === 'getDataSources') {
    data = datas
  } else if (event == 'init') {
    data = await authLogin()
  } else if (event === 'getUserDataProperty') {
    data = getUserDataProperty(params)
  } else if (event === 'setUserDataJsonProperty') {
    setUserDataJsonProperty(params.key, params.value)
  } else if (event === 'openDirectory') {
    data = await openDirectory(params.path, params.type)
  } else if (event === 'getDataBases') {
    // dbclient = await createDBClient({
    //   name: 'pgsql_name',
    //   dbType: 'pgsql',
    //   host: 'localhost',
    //   user: 'postgres',
    //   password: 'admin2312',
    //   database: 'lihaomin',
    //   port: 5432,
    //   timezone: '+00:00',
    // })
    data = await dbclient.getSchemas()
  } else if (event === 'getTables') {
    data = await dbclient.getTables(params.database)
  } else if (event === 'getTableData') {
    // data = await dbclient.getTableData(params.database, params.table)
  } else if (event === 'getTableDetail') {
    data = await dbclient.getTableStruct(params.database, params.table)
  } else if (event === 'getRoutines') {
    data = await dbclient.getProcedures(params.database)
  } else if (event === 'getProcedureDefinition') {
    data = await dbclient.getProcedureDetail(params.database, params.procName)
  } else if (event === 'getProcedureInout') {
    data = await dbclient.getProcedureParams(params.database, params.procName)
  } else if (event === 'login') {
    const userStat = await loginHeader(params)
    if (userStat.type != 'error') {
      data = await getUserInfo()
      job()
    } else {
      data = userStat?.message?.data
    }
  } else if (event === 'getUserInfo') {
    data = await getUserInfo()
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

    return { success: true, data: data }
  } else if (event === 'changeRole') {
    data = await setValueByPath('auth.role', params)
    // window.ipc.send()
  }
  // console.log('ipcHandle', event, params)
  return data
}

async function authLogin() {
  let userInfo = {}
  const authInfo = getUserDataProperty('auth')
  if (authInfo.username && authInfo.password) {
    await loginHeader(authInfo.username, authInfo.password, authInfo.role)
    userInfo = await getUserInfo()
    await job()
  }

  return userInfo.data
}

const jobTask = new CronJob('MyJob')
function job() {
  jobTask.setExpression('*/3 * * * * *')
  jobTask.setCallback(() => {
    console.log('定时任务触发', new Date().toLocaleTimeString())
    getUserInfo()

    let auth = getUserDataProperty('auth')
    if (auth.exception) {
      jobTask.stop()
      mainSendToRender('openLoginWin')
    }
    if (!auth.exception && !auth.isLogin) {
      authLogin()
    }
  })
  jobTask.start()
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

const mysql = require('mysql2/promise')
const { Client } = require('pg')

ipcMain.handle('test-connection', async (_, config) => {
  try {
    if (config.type === 'pgsql') {
      const client = new Client(config)
      await client.connect()
      await client.end()
    } else if (config.type === 'mysql') {
      const conn = await mysql.createConnection(config)
      await conn.ping()
      await conn.end()
    }
    return { success: true, message: '连接成功' }
  } catch (e) {
    return { success: false, message: e.message }
  }
})
import { getConfig, setConfig, initConfig } from './configStore.js'

export async function registerConfigIpcHandlers() {
  await initConfig()

  ipcMain.handle('config:get', (_, pathStr) => getConfig(pathStr))
  ipcMain.handle('config:set', async (_, pathStr, value) => {
    await setConfig(pathStr, value)
  })
}
module.exports = { ipcHandle }
