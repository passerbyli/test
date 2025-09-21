const { app, BrowserWindow, ipcMain } = require('electron')

const path = require('node:path')

// const db = require('./electron/db/postgres')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
const { initSpotlight } = require('./main/spotlight')

const { registerAllIpc, ipcHandle } = require('./electron/ipc/index')

const commonUtils = require('./common/commonUtil')
console.log(commonUtils.simpleHtmlToText('<p>Hello <strong>World</strong></p>'))
// if (!app.isPackaged) spotlightWindow.webContents.openDevTools({ mode: 'detach' })
let win = null
// 检查是否已存在实例
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  // 已经有一个实例在运行，退出当前进程
  app.quit()
} else {
  // 监听 second-instance 事件（第二次启动时触发）
  app.on('second-instance', (event, argv, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  // 创建窗口
  app.whenReady().then(() => {
    registerAllIpc(ipcMain)
    createWindow()
    initSpotlight()
  })

  // 所有窗口关闭时退出（可选，如果你希望退出应用时）
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}

function createWindow() {
  const iconPath = path.join(__dirname, 'public/icons/512x512.png')
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    // frame: false, // 去掉原生边框
    // autoHideMenuBar: true, // 隐藏菜单栏
    transparent: false, // 不设置透明（否则可能失效）
    roundedCorners: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js') // use a preload script
    },
    icon: iconPath
  })

  // 窗口控制监听
  ipcMain.on('window-minimize', () => win.minimize())
  ipcMain.on('window-maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })
  ipcMain.on('window-toggle-maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })

  // 隐藏菜单栏
  win.setMenuBarVisibility(false)

  // 或者禁止菜单栏显示快捷键（如 Alt 键呼出菜单）
  win.setAutoHideMenuBar(true)

  if (isDev) {
    win.loadURL('http://localhost:5173') // Vite 默认端口
  } else {
    win.loadFile(path.join(__dirname, 'pages/index.html'))
  }
  win.webContents.openDevTools()

  win.on('close', e => {
    e.preventDefault() // 阻止默认关闭行为
    if (win.isMinimized()) {
      win.restore()
    } else {
      win.minimize()
    }
  })
}

ipcMain.handle('refresh-window', () => {
  win.reload()
})
// ipcRenderer.invoke 处理
ipcMain.handle('toMain', async (e, args) => {
  return await ipcHandle(e, args)
})

// ipcRenderer.on 处理
ipcMain.on('toMain', async (e, args) => {
  if (!args || !args.event) {
    return
  }
  const data = await ipcHandle(e, args)
  const webContents = e.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.webContents.send('fromMain', { event: args.event, data: data })
})

app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
