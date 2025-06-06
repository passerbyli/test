const { BrowserWindow } = require('electron')

function log(...msg) {
  try {
    const windows = BrowserWindow.getAllWindows()
    if (!windows) {
      return
    }
    let currentWindow
    for (let i = 0; i < windows.length; i++) {
      const win = windows[i]

      if (win && win.title == 'Vite App') {
        currentWindow = win
        break
      }
    }
    if (currentWindow) {
      // 获取参数
      const params = msg.map((arg) => {
        if (typeof arg === 'string') {
          return arg
        } else {
          return JSON.stringify(arg)
        }
      })

      const str = params.join(' ')
      currentWindow.webContents &&
        currentWindow.webContents.send('fromMain', {
          event: 'console',
          data: str,
        })
    }
  } catch (error) {
    // arm中主进程打印日志可能抛异常，先注释
    // console.error("consoleLogUtil log error:", error);
  }
}

function error(...msg) {
  log(...msg)
}
module.exports = { log, error }
