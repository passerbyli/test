const registerAuthIpc = require('./authIpc')
const registerConfigIpc = require('./configIpc')
const registerDataSourceIpc = require('./dataSourceIpc')

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
}

module.exports = { registerAllIpc, ipcHandle }
