import { Low, JSONFile } from 'lowdb'
import fs from 'fs'
import path from 'path'
import { merge } from 'lodash'
import { app } from 'electron'

const userDataPath = app.getPath('userData')
const userConfigPath = path.join(userDataPath, 'config.json')
const defaultConfigPath = path.join(__dirname, 'assets', 'default-config.json')

let db

async function initConfig() {
  // 1. 加载默认配置
  const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'))

  // 2. 如果用户配置不存在 → 拷贝
  if (!fs.existsSync(userConfigPath)) {
    fs.writeFileSync(userConfigPath, JSON.stringify(defaultConfig, null, 2))
  } else {
    // 3. 合并默认配置 + 用户配置
    const userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'))
    const merged = merge({}, defaultConfig, userConfig)
    fs.writeFileSync(userConfigPath, JSON.stringify(merged, null, 2))
  }

  // 4. 初始化 LowDB
  const adapter = new JSONFile(userConfigPath)
  db = new Low(adapter)
  await db.read()
}

// 获取配置项（支持 path 访问）
function getConfig(pathStr, defaultValue = null) {
  return require('lodash').get(db.data, pathStr, defaultValue)
}

// 设置配置项
async function setConfig(pathStr, value) {
  require('lodash').set(db.data, pathStr, value)
  await db.write()
}

// 导出整个 config
function getAllConfig() {
  return db.data
}

export { initConfig, getConfig, setConfig, getAllConfig }
