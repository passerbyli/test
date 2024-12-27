// 和主进程相关的代码
import { app, BrowserWindow } from "electron";

let mainWindow = null; // 存储窗口实例

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(process.argv[2]);
});
