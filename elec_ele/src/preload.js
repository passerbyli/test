const { contextBridge, ipcRenderer } = require("electron");

// 暴露一个 API 给渲染进程
contextBridge.exposeInMainWorld("electron", {
  exportExcel: () => ipcRenderer.invoke("export-excel"),
});
