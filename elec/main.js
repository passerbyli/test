const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  ipcMain,
  dialog,
  nativeImage,
} = require("electron");
const path = require("path");
const fs = require("fs");
const configPath = path.join(__dirname, "config.json");

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "renderer.js"),
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(
    path.join(__dirname, "assets", "tray-icon.png")
  );
  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click: () => mainWindow.show(),
    },
    {
      label: "Quit",
      click: () => app.quit(),
    },
  ]);
  tray.setContextMenu(contextMenu);
}

function loadConfig() {
  if (fs.existsSync(configPath)) {
    const rawData = fs.readFileSync(configPath);
    return JSON.parse(rawData);
  } else {
    return {
      database: {
        host: "localhost",
        user: "root",
        password: "admin2312",
        database: "test",
      },
      exportPath: "/Users/lihaomin/projects/GitHub/test/elec——error",
      appAccount: {
        cookies: "",
        username: "admin",
        password: "123456",
        rememberMe: true,
      },
    };
  }
}

function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  // 设置系统托盘图标右键菜单
  tray.on("right-click", () => {
    tray.popUpContextMenu();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("loadConfig", () => loadConfig());
ipcMain.handle("saveConfig", (_, config) => saveConfig(config));

ipcMain.on("login-success", (event, userData) => {
  // 保存登录数据到 config.json
  let config = loadConfig();
  config.appAccount.username = userData.username;
  config.appAccount.password = userData.password;
  ipcMain.handle("saveConfig", () => saveConfig(config));

  // 返回登录成功的消息
  event.reply("login-success");
});
