const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  Notification,
} = require("electron");
const path = require("path");
const fs = require("fs");

// 配置文件路径：存放在用户数据目录下
const configPath = path.join(app.getPath("userData"), "config.json");

// 默认配置，如果配置文件不存在时创建
const defaultConfig = {
  appName: "My Electron App",
  version: app.getVersion(),
  settings: {
    closeOnExit: false,
    disableNotifications: false,
  },
};

// 读取或初始化配置文件
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
  } catch (err) {
    console.error("读取配置失败：", err);
    return defaultConfig;
  }
}

function writeConfig(newConfig) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("写入配置失败：", err);
    return false;
  }
}

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 确保路径正确
      nodeIntegration: false, // 禁用 Node.js 集成
      contextIsolation: true, // 启用上下文隔离
      enableRemoteModule: false, // 禁用远程模块（增强安全性）
    },
  });

  console.log(process.env.NODE_ENV);
  // 判断开发或生产环境
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:8080");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // 打开开发者工具（仅在开发环境中）
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
});

// IPC：获取应用配置
ipcMain.handle("get-config", async () => {
  return readConfig();
});

// IPC：保存应用配置
ipcMain.handle("save-config", async (event, newConfig) => {
  return writeConfig(newConfig);
});

// IPC：打开文件夹（如日志目录、配置目录等）
ipcMain.handle("open-folder", async (event, folderType) => {
  console.log("191923019120");
  let folderPath;
  switch (folderType) {
    case "logs":
      folderPath = path.join(app.getPath("userData"), "logs");
      break;
    case "config":
      folderPath = app.getPath("userData");
      break;
    case "export":
      folderPath = path.join(app.getPath("documents"), "MyElectronAppExports");
      break;
    default:
      folderPath = app.getPath("desktop");
  }
  // 如果目录不存在则创建
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  shell.openPath(folderPath);
  return folderPath;
});

// IPC：展示桌面通知（示例）
ipcMain.handle("show-notification", async (event, message) => {
  if (Notification.isSupported()) {
    new Notification({
      title: "任务提醒",
      body: message,
    }).show();
    return true;
  }
  return false;
});

// 示例：IPC 调用 MySQL 查询任务数据（mysql-helper.js 内实现）
const mysqlHelper = require("./mysql-helper");
ipcMain.handle("query-tasks", async (event, query) => {
  return await mysqlHelper.queryTasks(query);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
