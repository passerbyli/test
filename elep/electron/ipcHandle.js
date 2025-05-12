import { ipcMain } from 'electron'
import { getConfig, updateConfig } from './db/configDb.js'

ipcMain.handle('config:get', () => getConfig())
ipcMain.handle('config:update', (_, newData) => {
  updateConfig(newData)
  return { success: true }
})
