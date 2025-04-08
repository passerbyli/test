const { app } = require('electron')
const path = require('node:path')
const fs = require('node:fs')

const defaultConfigData = {
  settings: {
    dataBase: {
      host: '',
      user: '',
      password: '',
      database: '',
      port: 3306,
      timezone: '+08:00',
    },
    pm: {
      reminder: false,
      iteration: '迭代',
    },
    platform: {
      beta: { username: '', password: '', cookies: [] },
      prod: { username: '', password: '', cookies: [] },
    },
    config: {
      basePath: '',
    },
  },
  auth: {
    username: '',
    password: '',
    role: '开发',
    cookies: [],
    isLogin: false,
    exception: false,
  },
}

/**
 * 深度合并 defaultObj 和 newObj，保留尽可能多的字段
 */
function mergeJson(defaultObj, newObj) {
  const result = { ...defaultObj }

  for (const key in newObj) {
    if (newObj[key] !== null && typeof newObj[key] === 'object' && !Array.isArray(newObj[key])) {
      result[key] = mergeJson(defaultObj[key] || {}, newObj[key])
    } else {
      result[key] = newObj[key]
    }
  }

  return {
    ...result,
    ...Object.fromEntries(Object.entries(newObj).filter(([key]) => !(key in defaultObj))),
  }
}

function getIsLogin() {
  return getUserDataProperty('auth.isLogin')
}

function getUserData() {
  const dataPath = path.join(app.getPath('userData'), 'data.json')
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify(defaultConfigData), {
      encoding: 'utf-8',
    })
  }
  return mergeJson(defaultConfigData, JSON.parse(fs.readFileSync(dataPath, { encoding: 'utf-8' })))
}

function setUserData(params) {
  const dataPath = path.join(app.getPath('userData'), 'data.json')
  fs.writeFileSync(dataPath, JSON.stringify(params, null, 2), {
    encoding: 'utf-8',
  })
}

function setUserDataStr(strParams) {
  const dataPath = path.join(app.getPath('userData'), 'data.json')
  fs.writeFileSync(dataPath, strParams, { encoding: 'utf-8' })
}

function setUserDataProperty(key, value) {
  const data = getUserData()
  data[key] = value
  setUserData(data)
}

/**
 * 支持按照path获取值
 * @param {*} path
 * @returns
 */
function getUserDataProperty(path) {
  const keys = path.split('.')
  let current = getUserData()
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }
  return current
}

/**
 * 设置对象中的嵌套字段值（自动创建中间对象）
 * @param {Object} obj - 要修改的 JSON 对象
 * @param {string} path - 多层级路径，例如 "settings.database.host"
 * @param {*} value - 要设置的值
 */
function setValueByPath(path, value) {
  let config = getUserData()
  const keys = path.split('.')
  let current = config

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    // 如果是最后一层，设置值
    if (i === keys.length - 1) {
      current[key] = value
    } else {
      // 中间层若不存在则创建对象
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {}
      }
      current = current[key]
    }
  }
  setUserData(config)
}

function setUserDataJsonProperty(key, json) {
  let obj
  try {
    obj = JSON.parse(json)
  } catch (error) {}
  if (obj) {
    const data = getUserData()
    data[key] = obj
    setUserData(data)
  }
}

function getBasePath() {
  return getUserDataProperty('settings.config.basePath')
}

module.exports = {
  getIsLogin,
  getBasePath,
  getUserData,
  setUserData,
  setUserDataStr,
  getUserDataProperty,
  setUserDataProperty,
  setUserDataJsonProperty,
  setValueByPath,
}
