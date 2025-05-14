const { ipcMain } = require('electron')
const { getConfig, updateConfig } = require('../db/configDb')

const mysql = require('mysql2/promise')
const { Client } = require('pg')

function registerDataSourceIpc(ipcMain) {
  ipcMain.handle('ds:list', () => {
    const config = getConfig()
    return config.modules?.module4?.sources || []
  })

  ipcMain.handle('ds:save', (_, sources) => {
    const config = getConfig()
    const updated = {
      ...config.modules,
      module4: { ...config.modules.module4, sources },
    }
    updateConfig({ modules: updated })
    return { success: true }
  })

  ipcMain.handle('ds:test', async (_, ds) => {
    try {
      if (ds.type === 'MySQL') {
        const conn = await mysql.createConnection({
          host: ds.host,
          port: ds.port,
          user: ds.username,
          password: ds.password,
          database: ds.database,
        })
        await conn.ping()
        await conn.end()
      } else if (ds.type === 'PostgreSQL') {
        const client = new Client({
          host: ds.host,
          port: ds.port,
          user: ds.username,
          password: ds.password,
          database: ds.database,
        })
        await client.connect()
        await client.end()
      } else {
        throw new Error('不支持的数据源类型')
      }

      return { success: true, message: '连接成功' }
    } catch (err) {
      return { success: false, message: err.message }
    }
  })
}
module.exports = registerDataSourceIpc
