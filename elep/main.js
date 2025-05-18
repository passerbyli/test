const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  Notification,
  shell,
  dialog,
} = require('electron')
const path = require('node:path')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

const { registerAllIpc, ipcHandle } = require('./electron/ipc/index')
let win = null

function createWindow() {
  const iconPath = path.join(__dirname, 'public/favicon.png')
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1440,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'), // use a preload script
    },
    icon: iconPath,
  })
  if (isDev) {
    win.loadURL('http://localhost:5173') // Vite 默认端口
  } else {
    win.loadFile(path.join(__dirname, 'pages/index.html'))
  }
  win.webContents.openDevTools()
}

app.whenReady().then(function () {
  registerAllIpc(ipcMain)
  createWindow()
})

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
