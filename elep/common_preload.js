const { contextBridge, ipcRenderer } = require('electron')

const validSendChannels = ['toMain', 'refresh-window']
const validReceiveChannels = ['fromMain']
const validInvokeChannels = ['toMain', 'refresh-window']

contextBridge.exposeInMainWorld('ipc', {
  send(channel, data) {
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    } else {
      console.warn(`Invalid send channel: ${channel}`)
    }
  },

  receive(channel, listener) {
    if (validReceiveChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => listener(...args))
    } else {
      console.warn(`Invalid receive channel: ${channel}`)
    }
  },

  removeListener(channel, listener) {
    if (validReceiveChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, listener)
    }
  },

  once(channel, listener) {
    if (validReceiveChannels.includes(channel)) {
      ipcRenderer.once(channel, (event, ...args) => listener(...args))
    }
  },

  invoke(channel, data) {
    if (validInvokeChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data)
    } else {
      console.warn(`Invalid invoke channel: ${channel}`)
      return Promise.reject(`Invalid invoke channel: ${channel}`)
    }
  }
})
