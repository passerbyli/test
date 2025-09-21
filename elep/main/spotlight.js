const { BrowserWindow, globalShortcut, app } = require('electron')
let spotlightWindow = null

function createSpotlightWindow() {
  if (spotlightWindow && !spotlightWindow.isDestroyed()) {
    return // 避免重复创建
  }

  spotlightWindow = new BrowserWindow({
    width: 600,
    height: 80,
    frame: false,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
    center: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  const url = app.isPackaged ? `file://${__dirname}/../dist/index.html#/spotlight` : 'http://localhost:5173/#/spotlight'

  spotlightWindow.loadURL(url)

  // 避免误关窗口：只隐藏
  spotlightWindow.on('close', e => {
    e.preventDefault()
    spotlightWindow.hide()
  })

  // 失焦自动隐藏
  spotlightWindow.on('blur', () => {
    if (spotlightWindow && !spotlightWindow.isDestroyed()) {
      spotlightWindow.hide()
    }
  })
}

function toggleSpotlight() {
  if (!spotlightWindow || spotlightWindow.isDestroyed()) {
    console.warn('[Spotlight] 窗口不存在或已销毁，重新创建...')
    createSpotlightWindow()
  }

  if (spotlightWindow.isVisible()) {
    spotlightWindow.hide()
  } else {
    spotlightWindow.show()
    spotlightWindow.focus()
  }
}

function initSpotlight() {
  createSpotlightWindow()

  const success = globalShortcut.register('Command+Option+p', toggleSpotlight)
  if (!success) {
    console.error('❌ 快捷键注册失败：Command+Option+p')
  }
}

module.exports = { initSpotlight }
