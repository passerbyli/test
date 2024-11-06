const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getConfig: () => ipcRenderer.invoke("get-config"),
  saveConfig: (newConfig) => ipcRenderer.invoke("save-config", newConfig),
  openSettings: () => ipcRenderer.send("open-settings"),
  selectDirectory: () => ipcRenderer.invoke("select-directory"),
  convertJsonToExcel: (jsonContent) =>
    ipcRenderer.invoke("convert-json-to-excel", jsonContent),
  parseExcel: (filePath) => ipcRenderer.invoke("parse-excel", filePath),
  getWeather: (city) => ipcRenderer.invoke("get-weather", city),
  login: (credentials) => ipcRenderer.invoke("login", credentials),
  logout: () => ipcRenderer.send("logout"),
  openLogin: () => ipcRenderer.send("open-login"),
  onLoginStatusChange: (callback) =>
    ipcRenderer.on("login-status", (_, status) => callback(status)),
});
