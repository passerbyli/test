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
const { ipcHandle } = require('./server/ipcHandle')
const consoleLogUtil = require('./server/utils/consoleLogUtil')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
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

  const menuItems = Menu.getApplicationMenu().items
  const helpMenuItem = menuItems.find((item) => item.label === 'Help')
  if (helpMenuItem) {
    helpMenuItem.submenu.append(
      new MenuItem({
        label: '搜索',
        click: () => {
          shell.openExternal('https://baidu.com')
        },
      }),
    )

    helpMenuItem.submenu.append(
      new MenuItem({
        label: '关于',
        click: () => {
          const version = app.getVersion()
          const message = `Version: ${version}\r\nAuthor: hogan \r\nLicense: AGPL-3.0`

          dialog.showMessageBox({
            icon: iconPath,
            title: 'electronTest',
            message: message,
            buttons: ['OK'],
            type: 'none',
          })
        },
      }),
    )

    const menu = Menu.buildFromTemplate(menuItems)
    // 重新设置修改后的菜单
    Menu.setApplicationMenu(menu)
  }

  if (isDev) {
    win.loadURL('http://localhost:5173') // Vite 默认端口
  } else {
    win.loadFile(path.join(__dirname, 'pages/index.html'))
  }
  win.webContents.openDevTools()
}

ipcMain.handle('refresh-window', () => {
  console.log('----0000----')
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(function () {
  app.setAppUserModelId('testElectronProject')

  createWindow()

  if (!Notification.isSupported()) {
    consoleLogUtil.log('Notifications are not supported')
    return
  }

  // const notification = new Notification({
  //   title: '定时通知',
  //   body: '这是一个定时提醒！',
  // })
  // notification.show()

  // console.log("-----1:", Notification.requestPermission());
  // Notification.requestPermission().then((permission) => {
  //   console.log("-----2:", Notification.isSupported());
  //   if (permission === "granted") {
  //     consoleLogUtil.log("Notifications are granted");
  //   } else {
  //     consoleLogUtil.log("Notifications are denied");
  //   }
  // });
})

// Quit when all windows are closed.
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
