const { getConfig, updateConfig } = require('../db/configDb2.js')

function registerConfigIpc(ipcMain) {
  ipcMain.handle('config:get', () => {
    console.log('[IPC] config:get')
    return getConfig()
  })

  ipcMain.handle('config:update', (event, data) => {
    console.log('[IPC] config:update', data)
    updateConfig(data)
    return { success: true }
  })
}
module.exports = registerConfigIpc
