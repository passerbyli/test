const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const { getSettings, saveSettings } = require("./settings");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadFile("index.html");
}

// 选择 JSON 文件并导出 Excel
ipcMain.handle("select-json", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "JSON Files", extensions: ["json"] }],
  });
  if (result.canceled) return null;

  const filePath = result.filePaths[0];
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const worksheet = xlsx.utils.json_to_sheet(jsonData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 获取导出路径
  const settings = getSettings();
  const exportPath = settings.exportPath || app.getPath("documents");

  const { filePath: savePath } = await dialog.showSaveDialog({
    defaultPath: path.join(exportPath, "output.xlsx"),
  });

  if (savePath) {
    xlsx.writeFile(workbook, savePath);
    return savePath;
  }
});

// 处理获取和更新设置的请求
ipcMain.handle("get-settings", () => getSettings());
ipcMain.handle("save-settings", (_, newSettings) => saveSettings(newSettings));

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
