const { get, set, merge } = require('lodash')
const configStore = require('./configStore')
const userStore = require('./userStore')
const cacheStore = require('./cacheStore')

const stores = {
  config: configStore,
  user: userStore,
  cache: cacheStore,
}

module.exports = {
  getStore(storeName) {
    return stores[storeName]
  },

  getValue(storeName, key, defaultValue) {
    const store = stores[storeName]
    return store ? get(store.store, key, defaultValue) : undefined
  },

  setValue(storeName, key, value) {
    const store = stores[storeName]
    if (store) {
      const oldData = store.store
      const newData = {} // 临时对象
      set(newData, key, value) // 更新指定 key 的数据
      const mergedData = merge({}, oldData, newData) // 合并历史数据 + 新数据
      store.store = mergedData // 安全写入
    }
  },

  deleteValue(storeName, key) {
    const store = stores[storeName]
    if (store) {
      store.delete(key)
    }
  },

  hasKey(storeName, key) {
    const store = stores[storeName]
    return store ? store.has(key) : false
  },
}
