const { getUserDataProperty } = require('./storeUtil')
const http = require('http')
const Constants = require('../../constant/constants')
const path = require('path')

const https = require('https')
const consoleUtil = require('./consoleLogUtil')
const { Notification } = require('electron')
const noticeTitle = '测试'

function sendNotice(msg) {
  const userDataOptions = getUserDataProperty(Constants.StoreKeys.OPTIONS_KEY)
  const { enableDesktopNotification } = userDataOptions || {}

  if (enableDesktopNotification || undefined === enableDesktopNotification) {
    new Notification({
      title: noticeTitle,
      body: msg,
      silent: true, // 系统默认的通知声音
    }).show()
  }
}

module.exports = { sendNotice }
