const fs = require('fs')
const path = require('path')
const axios = require('axios')
const https = require('https')
const { getBasePath } = require('./storeUtil')
// const chalk = require('chalk') // 彩色输出

// 是否启用日志（可通过配置文件、env 或传参控制）
const ENABLE_LOG = process.env.ENABLE_API_LOG !== 'false'

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

function getLogFilePath() {
  const logsDir = path.join(getBasePath(), 'logs')
  fs.mkdirSync(logsDir, { recursive: true })
  return path.join(logsDir, `request_${getTodayStr()}.log`)
}

function formatJSON(data) {
  try {
    return JSON.stringify(data, null, 2)
  } catch (e) {
    return String(data)
  }
}

function logToFileAndConsole(type, lines = [], tag = '') {
  //   if (!ENABLE_LOG) return
  console.log('11100', getLogFilePath())
  const time = new Date().toISOString()
  const tagText = tag ? ` [${tag}]` : ''
  const title = `[${time}] ${type}${tagText}`
  const content = [title, ...lines.map((line) => `  ${line}`)].join('\n')

  fs.appendFileSync(getLogFilePath(), '\n' + content + '\n', 'utf-8')

  // const color = type.includes('Request')
  //   ? chalk.cyan
  //   : type.includes('Response')
  //     ? chalk.green
  //     : chalk.red

  // console.log(color(content))
}

// 创建 axios 实例
const myAxios = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  timeout: 10000,
})

// 请求拦截器
myAxios.interceptors.request.use(
  (config) => {
    config.meta = {
      startTime: Date.now(),
      tag: config.tag || (config.meta && config.meta.tag) || '',
    }

    logToFileAndConsole(
      '→ Request',
      [
        `URL: ${config.method.toUpperCase()} ${config.url}`,
        `Params: ${formatJSON(config.params || {})}`,
        `Data: ${formatJSON(config.data || {})}`,
      ],
      config.meta.tag,
    )

    return config
  },
  (error) => {
    logToFileAndConsole('× Request Error', [error.message])
    return Promise.reject(error)
  },
)

// 响应拦截器
myAxios.interceptors.response.use(
  (response) => {
    const { meta } = response.config
    const duration = Date.now() - (meta?.startTime || Date.now())

    logToFileAndConsole(
      '← Response',
      [
        `URL: ${response.config.method.toUpperCase()} ${response.config.url}`,
        `Status: ${response.status}`,
        `Duration: ${duration}ms`,
        `Response: ${formatJSON(response.data)}`,
      ],
      meta?.tag,
    )

    return response
  },
  (error) => {
    const config = error.config || {}
    const duration = Date.now() - (config.meta?.startTime || Date.now())
    const tag = config.meta?.tag

    const lines = [
      `URL: ${config.method?.toUpperCase()} ${config.url}`,
      `Duration: ${duration}ms`,
      `Error: ${error.message}`,
    ]

    if (error.response) {
      lines.splice(1, 0, `Status: ${error.response.status}`)
      lines.push(`Error Data: ${formatJSON(error.response.data)}`)
      logToFileAndConsole('× Response Error', lines, tag)
    } else {
      logToFileAndConsole('× Network Error', lines, tag)
    }

    return Promise.reject(error)
  },
)

module.exports = myAxios
