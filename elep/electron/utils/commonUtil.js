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
  // npm install play-sound

  // const path = require('path')
  // const { Notification, shell } = require('electron')
  // const { exec } = require('child_process')
  // const player = require('play-sound')({})

  // ipcMain.handle('show-notification', async (event, { title, body, url }) => {
  //   const notif = new Notification({
  //     title,
  //     body,
  //     silent: true, // 系统静音，改为自定义播放声音
  //   })

  //   notif.on('click', () => {
  //     if (url) shell.openExternal(url)
  //   })

  //   notif.show()

  //   // 播放本地声音（通知声音）
  //   player.play(path.join(__dirname, 'assets/notify.mp3'), function (err) {
  //     if (err) console.error('播放失败', err)
  //   })
  // })
}

module.exports = { sendNotice }
