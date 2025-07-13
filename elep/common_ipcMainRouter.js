const { ipcMain } = require('electron')

class IPCMainRouter {
  constructor() {
    this.handlers = new Map()
    this.listeners = new Map()
  }

  /**
   * 注册 handle (invoke 类型)
   */
  registerHandle(channel, handler) {
    if (this.handlers.has(channel)) {
      ipcMain.removeHandler(channel)
    }
    this.handlers.set(channel, handler)
    ipcMain.handle(channel, async (event, ...args) => {
      try {
        return await handler(event, ...args)
      } catch (err) {
        console.error(`[ipcMain.handle] ${channel} error:`, err)
        throw err
      }
    })
  }

  /**
   * 注册 on (send 类型)
   */
  registerListener(channel, listener) {
    if (this.listeners.has(channel)) {
      ipcMain.removeListener(channel, this.listeners.get(channel))
    }
    this.listeners.set(channel, listener)
    ipcMain.on(channel, listener)
  }

  /**
   * 移除 handle
   */
  removeHandle(channel) {
    if (this.handlers.has(channel)) {
      ipcMain.removeHandler(channel)
      this.handlers.delete(channel)
    }
  }

  /**
   * 移除 listener
   */
  removeListener(channel) {
    if (this.listeners.has(channel)) {
      ipcMain.removeListener(channel, this.listeners.get(channel))
      this.listeners.delete(channel)
    }
  }

  /**
   * 清理所有
   */
  clearAll() {
    for (const [channel] of this.handlers) {
      ipcMain.removeHandler(channel)
    }
    for (const [channel, listener] of this.listeners) {
      ipcMain.removeListener(channel, listener)
    }
    this.handlers.clear()
    this.listeners.clear()
  }
}

module.exports = new IPCMainRouter()
