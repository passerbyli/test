const { app, BrowserWindow, ipcMain, Tray, Menu, screen, clipboard, globalShortcut, desktopCapturer, Notification, nativeImage } = require('electron')

const path = require('node:path')

// const db = require('./electron/db/postgres')
const crud = require('./electron/db/crud')
const XLSX = require('xlsx')

const { exportToExcelFile } = require('./plugins/excel/excel')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

const { registerAllIpc, ipcHandle } = require('./electron/ipc/index')

let win = null
let tray = null
// 检查是否已存在实例
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  // 已经有一个实例在运行，退出当前进程
  app.quit()
} else {
  // 监听 second-instance 事件（第二次启动时触发）
  app.on('second-instance', (event, argv, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  // 创建窗口
  app.whenReady().then(() => {
    registerAllIpc(ipcMain)
    createWindow()
    registerGlobalShortcut()
  })

  // 所有窗口关闭时退出（可选，如果你希望退出应用时）
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}

function createWindow() {
  const iconPath = path.join(__dirname, 'public/icons/512x512.png')
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    // frame: false, // 去掉原生边框
    // autoHideMenuBar: true, // 隐藏菜单栏
    transparent: false, // 不设置透明（否则可能失效）
    roundedCorners: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js') // use a preload script
    },
    icon: iconPath
  })

  // 窗口控制监听
  ipcMain.on('window-minimize', () => win.minimize())
  ipcMain.on('window-maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })
  ipcMain.on('window-toggle-maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })

  createTray()

  // 隐藏菜单栏
  win.setMenuBarVisibility(false)

  // 或者禁止菜单栏显示快捷键（如 Alt 键呼出菜单）
  win.setAutoHideMenuBar(true)

  if (isDev) {
    win.loadURL('http://localhost:5173') // Vite 默认端口
  } else {
    win.loadFile(path.join(__dirname, 'pages/index.html'))
  }
  win.webContents.openDevTools()

  win.on('close', e => {
    e.preventDefault() // 阻止默认关闭行为
    if (win.isMinimized()) {
      win.restore()
    } else {
      win.minimize()
    }
  })
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'public/icons/512x512.png')) // 替换为你的图标

  const contextMenu = Menu.buildFromTemplate([{ label: '吸取屏幕颜色', click: handlePickColor }, { type: 'separator' }, { label: '退出', role: 'quit' }])
  tray.setToolTip('屏幕取色器')
  tray.setContextMenu(contextMenu)

  // macOS: 左键点击弹出菜单
  tray.on('click', () => {
    tray.popUpContextMenu(contextMenu)
  })

  // 兼容 Windows/Linux: 右键弹出
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
}
async function handlePickColor() {
  try {
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    const source = sources[0]

    const image = source.thumbnail
    const { x, y } = screen.getCursorScreenPoint()

    const bitmap = image.toBitmap()
    const width = image.getSize().width
    const i = (y * width + x) * 4
    const r = bitmap[i]
    const g = bitmap[i + 1]
    const b = bitmap[i + 2]

    const hex = `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`
    clipboard.writeText(hex)

    new Notification({ title: '吸色成功', body: hex }).show()
  } catch (e) {
    new Notification({ title: '吸色失败', body: e.message }).show()
  }
}

// app.whenReady().then(function () {})

ipcMain.handle('refresh-window', () => {
  win.reload()
})
// ipcRenderer.invoke 处理
ipcMain.handle('toMain', async (e, args) => {
  return await ipcHandle(e, args)
})

// ipcRenderer.on 处理
ipcMain.on('toMain', async (e, args) => {
  if (!args || !args.event) {
    return
  }
  const data = await ipcHandle(e, args)
  const webContents = e.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.webContents.send('fromMain', { event: args.event, data: data })
})

ipcMain.handle('table/query-all', async (event, args) => {
  const { filters, page, pageSize } = args
  const { keyword, dataSource, schema, layer } = filters

  let sql = `
    SELECT t.id, 
    t.name AS table_name, 
    t.layer, t.type, 
    t.description,
    t.schema_name
    FROM ads_dl.metadata_table t
    WHERE 1=1
  `
  const params = []

  if (keyword) {
    sql += ` AND (t.name ILIKE $${params.length + 1} OR t.description ILIKE $${params.length + 1})`
    params.push(`%${keyword}%`)
  }
  if (dataSource) {
    sql += ` AND d.name = $${params.length + 1}`
    params.push(dataSource)
  }
  if (schema) {
    sql += ` AND s.name = $${params.length + 1}`
    params.push(schema)
  }
  if (layer) {
    sql += ` AND t.layer = $${params.length + 1}`
    params.push(layer)
  }

  return await crud.queryWithPagination('pg1', sql, params, { page, pageSize })
})

ipcMain.handle('table/distinct-options', async () => {
  return {
    dataSources: await crud.getDistinctValues('table_metadata', 'name'),
    schemas: await crud.getDistinctValues('schema_metadata', 'name'),
    layers: await crud.getDistinctValues('table_metadata', 'layer')
  }
})

ipcMain.handle('table/export-all', async (event, filters) => {
  // 同 query-all 中构造 SQL，只是不分页
  const { keyword, dataSource, schema, layer } = filters
  let sql = `
    SELECT t.name AS table_name, t.layer, t.type, t.description,
           s.name AS schema_name, d.name AS data_source
    FROM table_metadata t
    LEFT JOIN schema_metadata s ON t.schema_uuid = s.uuid
    LEFT JOIN data_source d ON s.data_source_uuid = d.uuid
    WHERE 1=1
  `
  const params = []

  if (keyword) {
    sql += ` AND (t.name ILIKE $${params.length + 1} OR t.description ILIKE $${params.length + 1})`
    params.push(`%${keyword}%`)
  }
  if (dataSource) {
    sql += ` AND d.name = $${params.length + 1}`
    params.push(dataSource)
  }
  if (schema) {
    sql += ` AND s.name = $${params.length + 1}`
    params.push(schema)
  }
  if (layer) {
    sql += ` AND t.layer = $${params.length + 1}`
    params.push(layer)
  }

  return await crud.query(sql, params)
})

ipcMain.handle('table/export-all-to-file', async (event, filters) => {
  const data = await crud.queryTableExport(filters)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: '导出表清单',
    defaultPath: 'table_list_export.xlsx',
    filters: [{ name: 'Excel', extensions: ['xlsx'] }]
  })

  if (canceled || !filePath) return null

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Tables')
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  fs.writeFileSync(filePath, buffer)
  return filePath
})

ipcMain.handle('diffApiByRoute', async (event, route_id) => {
  let sql = `
    SELECT
      COALESCE(p.api_id, t.api_id) AS api_id,

      CASE WHEN p.name IS DISTINCT FROM t.name THEN 'DIFF' ELSE '' END AS name_diff,
      CASE WHEN p.url IS DISTINCT FROM t.url THEN 'DIFF' ELSE '' END AS url_diff,
      CASE WHEN p.input_params IS DISTINCT FROM t.input_params THEN 'DIFF' ELSE '' END AS input_diff,
      CASE WHEN p.output_params IS DISTINCT FROM t.output_params THEN 'DIFF' ELSE '' END AS output_diff,
      CASE WHEN p.backend_script IS DISTINCT FROM t.backend_script THEN 'DIFF' ELSE '' END AS backend_diff,

      p.name  AS prod_name,
      t.name  AS test_name,
      p.url   AS prod_url,
      t.url   AS test_url,
      p.input_params  AS prod_input,
      t.input_params  AS test_input,
      p.output_params AS prod_output,
      t.output_params AS test_output

    FROM
      (SELECT * FROM ads_dl.metadata_api WHERE env = 'prod' AND route_id =$1) p
    FULL OUTER JOIN
      (SELECT * FROM ads_dl.metadata_api WHERE env = 'test' AND route_id = $1) t
    ON p.api_id = t.api_id
    ORDER BY api_id
  `
  const params = []
  if (route_id) {
    params.push(`${route_id}`)
  }
  const result = await crud.query('pg1', '', sql, params)
  return result.rows
})

ipcMain.handle('getApiDetailByRouteId', async (event, route_id) => {
  const sql = `
  SELECT env,
         jsonb_build_object(
           'id', id,
           'api_id', api_id,
           'name', name,
           'url', url,
           'description', description,
           'request_example', request_example,
           'input_params', input_params,
           'output_params', output_params,
           'backend_script', backend_script
         ) AS data
  FROM ads_dl.metadata_api
  WHERE route_id = $1 AND env IN ('prod','test')`
  const rows = await crud.query('pg1', '', sql, [route_id])
  const result = { prod: null, test: null }
  rows.forEach(r => (result[r.env] = r.data))
  return result
})

ipcMain.handle('queryApiListByRoute', async (event, params) => {
  const { page, pageSize, nameLike, routeLike, urlLike, domain, authType, impl } = {
    ...{
      page: 1,
      pageSize: 20,
      nameLike: '',
      routeLike: '',
      urlLike: '',
      domain: '',
      authType: '',
      impl: ''
    },
    ...params
  }

  console.log(page, pageSize, nameLike, routeLike, urlLike, domain, authType, impl)
  // 过滤条件
  const where = []
  const values = []
  let idx = 1
  if (nameLike) {
    where.push(`(p.name ILIKE $${idx} OR t.name ILIKE $${idx})`)
    values.push(`%${nameLike}%`)
    idx++
  }
  if (routeLike) {
    where.push(`(p.route ILIKE $${idx} OR t.route ILIKE  $${idx})`)
    values.push(`%${routeLike}%`)
    idx++
  }
  if (urlLike) {
    where.push(`(p.url ILIKE $${idx} OR t.url ILIKE  $${idx})`)
    values.push(`%${urlLike}%`)
    idx++
  }
  if (domain) {
    where.push(`COALESCE(p.domain,t.domain)= $${idx}`)
    values.push(`${domain}`)
    idx++
  }
  if (authType) {
    where.push(`COALESCE(p.auth_type,t.auth_type)= $${idx}`)
    values.push(`${authType}`)
    idx++
  }
  if (impl) {
    where.push(`COALESCE(p.impl,t.impl)= $${idx}`)
    values.push(`${impl}`)
    idx++
  }
  const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const baseSQL = `
    FROM
      (SELECT * FROM ads_dl.metadata_api WHERE env='prod') p
    FULL JOIN
      (SELECT * FROM ads_dl.metadata_api WHERE env='test') t
    ON p.route_id = t.route_id
    ${whereSQL}
  `

  // total
  const totalRes = await crud.query('pg1', '', `SELECT COUNT(DISTINCT COALESCE(p.route_id,t.route_id)) ${baseSQL}`, values)
  console.log('--====', totalRes)
  const total = Number(totalRes[0].count)

  // data
  const offset = (page - 1) * pageSize
  const dataSQL = `
    SELECT
      COALESCE(p.route_id,t.route_id)  AS route_id,
      COALESCE(p.route,t.route)        AS route_name,
      p.api_id                         AS prod_api_id,
      t.api_id                         AS test_api_id,
      p.name                           AS prod_name,
      t.name                           AS test_name,
      p.url                            AS prod_url,
      t.url                            AS test_url,
      COALESCE(p.domain,t.domain)      AS domain,
      COALESCE(p.impl,t.impl)          AS impl,
      COALESCE(p.auth_type,t.auth_type)AS auth_type,
      COALESCE(p.description,t.description) AS description
    ${baseSQL}
   GROUP BY COALESCE(p.route_id, t.route_id),
         COALESCE(p.route, t.route),
         prod_api_id, test_api_id, prod_name, test_name,
         prod_url, test_url,
         COALESCE(p.domain, t.domain),
         COALESCE(p.impl, t.impl),
         COALESCE(p.auth_type, t.auth_type),
         COALESCE(p.description, t.description)
    ORDER BY route_id
    LIMIT $${idx} OFFSET $${idx + 1}
  `

  values.push(`${pageSize}`)
  values.push(`${offset}`)

  const dataRes = await crud.query('pg1', '', dataSQL, values)

  return { total, list: dataRes }
})

ipcMain.handle('queryApiListByRoute——bak', async event => {
  let sql = `
    SELECT
      COALESCE(prod.route_id, test.route_id) AS route_id,
      COALESCE(prod.route, test.route) AS route,

      prod.api_id AS prod_api_id,
      test.api_id AS test_api_id,

      prod.env AS prod_env,
      test.env AS test_env

    FROM
      (SELECT route_id, route, api_id, env FROM ads_dl.metadata_api WHERE env = 'prod') prod
    FULL OUTER JOIN
      (SELECT route_id, route, api_id, env FROM ads_dl.metadata_api WHERE env = 'test') test
    ON prod.route_id = test.route_id
    ORDER BY route_id;
  `

  const result = await crud.query('pg1', 'xxxaaa', sql)
  console.log('---', result)
  return result
})

ipcMain.handle('get-table-detail', async (event, data) => {
  let { id } = data
  let sql = `
SELECT
t.uuid as table_uuid,
    t.name AS table_name,
    t.schema_name as table_schema_name,
    t.layer as table_layer,
    t.type as table_type,
    t.description as table_description,
    t.table_statement,
    c.name AS column_name,
    c.description as column_description
FROM ads_dl.metadata_field c
         LEFT JOIN ads_dl.metadata_table t ON t.uuid = c.table_uuid
  WHERE 1=1`

  const params = []

  if (id) {
    sql += ` AND c.table_uuid = $${params.length + 1}`
    params.push(id)
  }
  const tableInfo = await crud.query('pg1', sql, params)
  return { tableInfo }
})

ipcMain.handle('get-table-data-view', async (event, data) => {
  let { table_schema_name, table_name } = data
  let sql = `
SELECT
*
FROM ${table_schema_name}.${table_name}
limit 10
 `

  const params = []

  const tableInfo = await crud.query('pg1', sql, params)
  return tableInfo
})

app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

let pickerWin = null

function registerGlobalShortcut() {
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    openColorPickerOverlay()
  })
}

function openColorPickerOverlay() {
  if (pickerWin) return

  pickerWin = new BrowserWindow({
    fullscreen: true,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'plugins/colorPicker/pickerPreload.js')
    }
  })

  pickerWin.setIgnoreMouseEvents(false)
  pickerWin.loadFile(path.join(__dirname, 'plugins/colorPicker/pickerWindow.html'))

  pickerWin.on('closed', () => {
    pickerWin = null
  })
}

// 关闭吸色窗口
ipcMain.on('close-picker', () => {
  pickerWin?.close()
  pickerWin = null
})

// 提供截图
ipcMain.handle('get-screen', async () => {
  const sources = await desktopCapturer.getSources({ types: ['screen'] })
  return sources[0].thumbnail.toDataURL()
})

const { openChromeWithPlugin } = require('./plugins/common/openChromeWithPlugin')
const { log } = require('./common/commonUtil')

ipcMain.handle('plugin:launch-chrome', async () => {
  let pluginPath = path.join(__dirname, 'chrome/my-extensiondebug')
  pluginPath = '/Users/lihaomin/projects/GitHub/test/chrome/my-extensiondebug'
  const guidePath = path.join(__dirname, './public/plugin-guide.html')
  openChromeWithPlugin(pluginPath, guidePath)
  return 'done'
})

ipcMain.handle('export-excel', async (event, { list, headers }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: '保存 Excel 文件',
    defaultPath: '导出结果.xlsx',
    filters: [{ name: 'Excel 文件', extensions: ['xlsx'] }]
  })

  if (canceled || !filePath) {
    return { success: false, message: '用户取消导出' }
  }

  try {
    exportToExcelFile(list, headers, filePath)
    return { success: true, path: filePath }
  } catch (err) {
    return { success: false, message: err.message }
  }
})
