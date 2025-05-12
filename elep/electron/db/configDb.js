// electron/db/configDb.js
const Store = require('electron-store')

const store = new Store({
  name: 'config', // 会保存为 config.json
  defaults: {
    global: {
      isLogin: false,
      theme: 'light',
      language: 'zh_CN',
      notify: { disable: false },
    },
    modules: {
      module2: {
        cronJobs: { cronJob1: '', cronJob2: '' },
        type: 'PI',
      },
      module3: {
        accounts: {
          beta: { username: '', password: '', cookies: [] },
          pord: { username: '', password: '', cookies: [] },
        },
        currentEnv: 'beta',
      },
    },
  },
})

function getConfig() {
  return store.store
}

function updateConfig(newData) {
  store.store = { ...store.store, ...newData }
}

module.exports = { getConfig, updateConfig }
