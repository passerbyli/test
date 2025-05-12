// electron/db/configDb.js
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { app } = require('electron')
const path = require('path')
const fs = require('fs')

// 路径配置
const configPath = path.join(app.getPath('userData'), 'config.json')

// 默认配置
const defaultConfig = {
  global: {
    isLogin: false,
    theme: 'light',
    language: 'zh_CN',
    notify: { disable: false },
  },
  modules: {
    module2: {
      cronJobs: { cronJob1: '', cronJob2: '' },
      type: 'PI',
    },
    module3: {
      accounts: {
        beta: { username: '', password: '', cookies: [] },
        pord: { username: '', password: '', cookies: [] },
      },
      currentEnv: 'beta',
    },
  },
}

// 如果文件不存在，写入默认配置
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8')
}

// 初始化 lowdb 实例
const adapter = new FileSync(configPath)
const db = low(adapter)
db.defaults(defaultConfig).write()

function getConfig() {
  return db.getState()
}

function updateConfig(newData) {
  db.setState({ ...db.getState(), ...newData }).write()
}

module.exports = {
  getConfig,
  updateConfig,
}
