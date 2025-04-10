const Store = require('electron-store')

const cacheStore = new Store({
  name: 'cacheData',
  defaults: {},
})

module.exports = cacheStore
