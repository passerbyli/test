const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exportExcel } = require("./dataService");

// 创建主窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 指定预加载脚本
      nodeIntegration: false, // 禁用渲染进程中的 Node.js 集成
      contextIsolation: true, // 启用上下文隔离
    },
  });

  win.loadFile("src/index.html"); // 可以加载一个前端页面，或者直接展示HTML文件
}

// 处理导出Excel的请求
ipcMain.handle("export-excel", async () => {
  const outputFilePath = await exportExcel();
  return outputFilePath;
});

// 启动Electron应用
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
