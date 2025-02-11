const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;

// 获取 `config.json` 的路径
const configPath = path.join(app.getPath("userData"), "config.json");

// 默认配置
const defaultConfig = {
  appName: "Electron 桌面应用1",
  version: app.getVersion(),
};

// 读取配置
function readConfig() {
  try {
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(
        configPath,
        JSON.stringify(defaultConfig, null, 2),
        "utf-8"
      );
      return defaultConfig;
    }
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (error) {
    console.error("读取配置失败:", error);
    return defaultConfig;
  }
}

// 监听 Vue 组件请求获取应用配置
ipcMain.handle("get-app-config", async () => {
  return readConfig();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 预加载
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  // mainWindow.loadURL("http://localhost:8080");
  mainWindow.loadFile(path.join(__dirname, "dist/index.html"));
  // 打开开发者工具（可选）
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
