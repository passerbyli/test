const { contextBridge, ipcRenderer } = require("electron");

// 通过 contextBridge 暴露安全的接口
contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data), // 发送事件
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)), // 接收事件
  invoke: (channel, data) => ipcRenderer.invoke(channel, data), // 异步调用
});
