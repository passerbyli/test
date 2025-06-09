const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
  getScreenshot: () => ipcRenderer.invoke('get-screen'),
  closePicker: () => ipcRenderer.send('close-picker'),
})

console.log('0-----')
