const { getUserDataProperty, setUserDataJsonProperty } = require('./utils/storeUtil')

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
    data = await openDirectory(params)
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
    data = await main(params)
  }
  console.log('ipcHandle', event, params)
  return data
}

async function openDirectory(type) {
  let settingConfig = await getUserDataProperty('settings')
  let folderPath = path.join(app.getPath('userData'))
  if (type === 'config') {
  } else if (type === 'log') {
    folderPath = path.join(settingConfig.config.basePath, 'log')
  } else if (type === 'export') {
    folderPath = path.join(settingConfig.config.basePath, 'export')
  }
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
