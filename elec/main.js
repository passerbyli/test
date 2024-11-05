const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { getConfig, setConfig } = require("./config");
const { generateExcel } = require("./excelGenerator");

let mainWindow;
let settingsWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile("index.html");
}

function createSettingsWindow() {
  if (settingsWindow) return;

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 400,
    parent: mainWindow,
    modal: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "settingsRenderer.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  settingsWindow.loadFile("settings.html");

  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
}

// 打开设置窗口
ipcMain.on("open-settings", () => {
  if (!settingsWindow) createSettingsWindow();
  settingsWindow.show();
});

// 文件选择
ipcMain.handle("select-file", async () => {
  return await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "JSON", extensions: ["json"] }],
  });
});

// 选择导出路径（文件夹）
ipcMain.handle("select-directory", async () => {
  return await dialog.showOpenDialog({ properties: ["openDirectory"] });
});

// 获取配置
ipcMain.handle("get-config", () => {
  return getConfig();
});

// 更新配置
ipcMain.handle("update-config", (event, newConfig) => {
  setConfig(newConfig);
});

// 生成 Excel 文件
ipcMain.handle("generate-excel", async (_, filePath) => {
  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const exportPath = await generateExcel(jsonData);
    return { success: true, path: exportPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.whenReady().then(createMainWindow);
