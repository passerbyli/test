const { getConfig, updateConfig } = require('../db/configDb2.js')

const consoleUtil = require('../utils/consoleLogUtil.js')
function registerAuthIpc(ipcMain) {
  ipcMain.handle('auth:login', (_, { username, password, role }) => {
    console.log('[IPC] auth:login')
    const config = getConfig()
    let auth = config.global.auth || {}

    if (true) {
      // if (username === auth.username && password === auth.password) {
      auth = { username, password, role }
      updateConfig({
        global: {
          ...config.global,
          auth: auth,
          isLogin: true,
        },
      })
      return { success: true, type: '', user: auth }
    } else {
      return { success: false, message: '用户名或密码错误' }
    }
  })

  ipcMain.handle('auth:logout', () => {
    const config = getConfig()
    updateConfig({
      global: {
        ...config.global,
        isLogin: false,
      },
    })
    return { success: true }
  })

  ipcMain.handle('auth:changeRole', (_, { role }) => {
    const config = getConfig()
    let auth = config.global.auth
    auth.role = role
    updateConfig({
      global: {
        ...config.global,
        auth,
      },
    })
    return { success: true }
  })
}

module.exports = registerAuthIpc
