const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipc", {
  send: (channel, data) => {
    console.log("ipc send");
    let validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["fromMain"];
    console.log("ipc validChannels", channel, validChannels.includes(channel));
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  sendInvoke: (channel, data) => {
    let validChannels = ["toMain"];
    console.log("ipc validChannels toMain", channel);
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  },
});
