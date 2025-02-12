// preload.js
const { contextBridge, ipcRenderer } = require("electron");

const fs = require("fs");
console.log("Preload script loaded"); // 确保脚本加载

// 使用 contextBridge 暴露 API
contextBridge.exposeInMainWorld("electronAPI", {
  getConfig: () => ipcRenderer.invoke("get-config"),
  openFolder: (folderType) => ipcRenderer.invoke("open-folder", folderType),
  showNotification: (message) =>
    ipcRenderer.invoke("show-notification", message),
  fs: fs, // 暴露 fs API
});

console.log("Electron API exposed:", window.electronAPI); // 检查是否暴露成功
