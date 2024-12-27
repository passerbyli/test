const { app, BrowserWindow, ipcMain } = require("electron");
require("electron-reload")(__dirname);

let win = null; // 存储窗口实例

// 创建窗口方法
const createWindow = () => {
  win = new BrowserWindow({
    width: 400,
    height: 650,
    frame: false,
    // transparent: true,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("window/index.html");
};

// whenReady 是一个生命周期方法，当 Electron 完成初始化后会调用这个方法
app.whenReady().then(() => {
  createWindow();
});

// 最小化窗口
ipcMain.on("minimizeWindow", () => {
  win.minimize();
});

// 关闭应用
ipcMain.on("closeWindow", () => {
  win.close();
});
