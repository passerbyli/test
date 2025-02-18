const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  dialog,
  shell,
} = require("electron");
const path = require("node:path");
const { ipcHandle } = require("./server/ipcHandle");
const { getUserDataProperty } = require("./server/utils/storeUtil");
const Constants = require("./constant/constants");

function createWindow() {
  const iconPath = path.join(__dirname, "public/favicon.png");
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1440,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"), // use a preload script
    },
    icon: iconPath,
  });

  win.loadURL("http://localhost:8080");
  win.webContents.openDevTools();
}

app.whenReady().then(function () {
  createWindow();

  // 查询是否启用自动更新，未查到时，默认自动更新
  const options = getUserDataProperty(Constants.StoreKeys.OPTIONS_KEY) || {};
  const enableAutoUpdate = options.enableAutoUpdate;
  if (
    enableAutoUpdate === undefined ||
    enableAutoUpdate === null ||
    enableAutoUpdate
  ) {
  }
});

// ipcRenderer.invoke 处理
ipcMain.handle("toMain", async (e, args) => {
  console.log("root main handle toMain");
  return await ipcHandle(e, args);
});

// ipcRenderer.on 处理
ipcMain.on("toMain", async (e, args) => {
  console.log("root main on toMain");
  if (!args || !args.event) {
    return;
  }
  const data = await ipcHandle(e, args);
  const webContents = e.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.webContents.send("fromMain", { event: args.event, data: data });
});
