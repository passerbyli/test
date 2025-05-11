const Store = require('electron-store')

const userStore = new Store({
  name: 'userData',
  defaults: {
    userInfo: {},
    token: '',
    loginStatus: false,
  },
})

module.exports = userStore
