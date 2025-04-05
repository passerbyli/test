const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { readConfig } = require("./src/utils/fileUtils"); // 使用 require

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL("http://localhost:8080"); // 如果你用 Vue CLI
  // mainWindow.loadFile(path.join(__dirname, 'index.html')); // 如果你用 Vue + Webpack 打包

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// 配置读取和保存
ipcMain.handle("get-config", () => {
  return readConfig();
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
