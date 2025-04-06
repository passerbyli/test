const { getUserDataProperty } = require('./storeUtil')

const consoleUtil = require('./consoleLogUtil')
const { Notification } = require('electron')
const noticeTitle = '测试'

function sendNotice(msg) {
  const reminder = getUserDataProperty('settings.pm.reminder')

  if (reminder) {
    new Notification({
      title: noticeTitle,
      body: msg,
      silent: true, // 系统默认的通知声音
    }).show()
  }
}

module.exports = { sendNotice }
