const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('configApi', {
  getConfig: () => ipcRenderer.invoke('config:get'),
  updateConfig: (data) => ipcRenderer.invoke('config:update', data),
})
contextBridge.exposeInMainWorld('authApi', {
  login: (data) => ipcRenderer.invoke('auth:login', data),
  logout: () => ipcRenderer.invoke('auth:logout'),
  changeRole: (data) => ipcRenderer.invoke('auth:changeRole', data),
  checkLogin: () => ipcRenderer.invoke('auth:checkLogin'),
  authLogin: () => ipcRenderer.invoke('auth:authLogin'),
})



contextBridge.exposeInMainWorld('ipc', {
  send: (channel, data) => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel, func) => {
    let validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  sendInvoke: (channel, data) => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data)
    }
  },
  refreshWindow: () => ipcRenderer.invoke('refresh-window'),
})

contextBridge.exposeInMainWorld('dsApi', {
  list: () => ipcRenderer.invoke('ds:list'),
  save: data => ipcRenderer.invoke('ds:save', data),
  test: ds => ipcRenderer.invoke('ds:test', ds)
})

contextBridge.exposeInMainWorld('dbAPI', {
  getAllTables: () => ipcRenderer.invoke('get-all-tables'),
  getTableDetail: (params) => ipcRenderer.invoke('get-table-detail', params),

  tableQueryAll: (params) => ipcRenderer.invoke('table/query-all', params),
  tableQueryDataView: (params) => ipcRenderer.invoke('get-table-data-view', params),

  tableDistinctOptions: () => ipcRenderer.invoke('table/distinct-options'),
  tableExportAll: (filters) => ipcRenderer.invoke('table/export-all', filters),
  exportToFile: (filters) => ipcRenderer.invoke('table/export-all-to-file', filters),
})

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  toggleMaximize: () => ipcRenderer.send('window-toggle-maximize'),
})

contextBridge.exposeInMainWorld('serviceApi', {
  diffApiByRoute: (router_id) => ipcRenderer.invoke('diffApiByRoute', router_id),
  queryApiListByRoute: (params) => ipcRenderer.invoke('queryApiListByRoute', params),
  getApiDetailByRouteId: (router_id) => ipcRenderer.invoke('getApiDetailByRouteId', router_id),
})
