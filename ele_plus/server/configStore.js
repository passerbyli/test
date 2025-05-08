// 文件路径：electron-main/configStore.js
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import fs from 'fs'
import { merge, get as lodashGet, set as lodashSet } from 'lodash'
import { app, ipcMain } from 'electron'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const userDataPath = app.getPath('userData')
const userConfigPath = path.join(userDataPath, 'config.json')
const defaultConfigPath = path.join(__dirname, '../assets/default-config.json')

let db

export async function initConfig() {
  const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'))

  if (!fs.existsSync(userConfigPath)) {
    fs.writeFileSync(userConfigPath, JSON.stringify(defaultConfig, null, 2))
  } else {
    const userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'))
    const merged = merge({}, defaultConfig, userConfig)
    fs.writeFileSync(userConfigPath, JSON.stringify(merged, null, 2))
  }

  const adapter = new JSONFile(userConfigPath)
  db = new Low(adapter)
  await db.read()
}

export function getConfig(pathStr, defaultVal = null) {
  return lodashGet(db.data, pathStr, defaultVal)
}

export async function setConfig(pathStr, value) {
  lodashSet(db.data, pathStr, value)
  await db.write()
}

export function getAllConfig() {
  return db.data
}

export async function registerConfigIpcHandlers() {
  await initConfig()
  ipcMain.handle('config:get', (_, pathStr) => getConfig(pathStr))
  ipcMain.handle('config:set', async (_, pathStr, value) => {
    await setConfig(pathStr, value)
  })
}
