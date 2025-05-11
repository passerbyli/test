// 文件路径：electron-main/dataSourceStore.js
import { ipcMain } from 'electron'
import { getConfig, setConfig } from './configStore.js'

function getSourcePath() {
  return 'modules.datasource.sources'
}

function getActivePath() {
  return 'modules.datasource.currentActiveId'
}

export async function registerDataSourceIpcHandlers() {
  ipcMain.handle('datasource:list', async () => {
    return await getConfig(getSourcePath(), [])
  })

  ipcMain.handle('datasource:getActiveId', async () => {
    return await getConfig(getActivePath(), '')
  })

  ipcMain.handle('datasource:addOrUpdate', async (_, newDs) => {
    const sources = await getConfig(getSourcePath(), [])
    const idx = sources.findIndex((ds) => ds.id === newDs.id)
    if (idx >= 0) sources[idx] = newDs
    else sources.push(newDs)
    await setConfig(getSourcePath(), sources)
    return true
  })

  ipcMain.handle('datasource:delete', async (_, id) => {
    const sources = await getConfig(getSourcePath(), [])
    const updated = sources.filter((ds) => ds.id !== id)
    await setConfig(getSourcePath(), updated)
    return true
  })

  ipcMain.handle('datasource:setActive', async (_, id) => {
    await setConfig(getActivePath(), id)
    return true
  })
}
