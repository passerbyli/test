const { Notification } = require('electron')
const path = require('path')
const { getConfig } = require('../db/configDb')

const noticeTitle = 'Test'
function sendNotice(msg) {
  const config = getConfig()
  const reminder = config.global.notify.disable

  if (reminder) {
    new Notification({
      icon: path.join(__dirname, '../../public/favicon.png'),
      title: noticeTitle,
      body: msg,

      sound: path.join(__dirname, '../../public/朴树+-+平凡之路.mp3'),
      silent: true, // 系统默认的通知声音
      href: 'https://www.cnblogs.com/binglicheng/', // 地址
    }).show()
  }
}

module.exports = { sendNotice }
