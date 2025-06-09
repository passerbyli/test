const { BrowserWindow } = require('electron')

function log(...msg) {
  try {
    const windows = BrowserWindow.getAllWindows()
    if (!windows) {
      return
    }
    let currentWindow
    for (let i = 0; i < windows.length; i++) {
      const win = windows[i]

      if (win && win.title == 'Vite App') {
        currentWindow = win
        break
      }
    }
    if (currentWindow) {
      // 获取参数
      const params = msg.map((arg) => {
        if (typeof arg === 'string') {
          return arg
        } else {
          return JSON.stringify(arg)
        }
      })

      const str = params.join(' ')
      currentWindow.webContents &&
        currentWindow.webContents.send('fromMain', {
          event: 'console',
          data: str,
        })
    }
  } catch (error) {
    // arm中主进程打印日志可能抛异常，先注释
    // console.error("consoleLogUtil log error:", error);
  }
}

function error(...msg) {
  log(...msg)
}

function deepSort(value) {
  if (Array.isArray(value)) {
    return value.map(deepSort).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
  } else if (value && typeof value === 'object') {
    const sorted = {}
    Object.keys(value)
      .sort()
      .forEach((key) => {
        sorted[key] = deepSort(value[key])
      })
    return sorted
  } else {
    return value
  }
}

function compareJsonDeep(a, b) {
  a = deepSort(a)
  b = deepSort(b)

  const result = {
    added: {},
    removed: {},
    changed: {},
    unchanged: {},
  }

  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})])
  for (const key of keys) {
    const valA = a?.[key]
    const valB = b?.[key]

    if (!(key in a)) {
      result.added[key] = valB
    } else if (!(key in b)) {
      result.removed[key] = valA
    } else if (JSON.stringify(valA) !== JSON.stringify(valB)) {
      if (typeof valA === 'object' && typeof valB === 'object') {
        // 深度递归
        const childDiff = compareJsonDeep(valA, valB)
        result.changed[key] = childDiff
      } else {
        result.changed[key] = { old: valA, new: valB }
      }
    } else {
      result.unchanged[key] = valA
    }
  }

  return result
}

function compareJsonSendToFrontend(jsonA, jsonB) {
  const diff = compareJsonDeep(jsonA, jsonB)
  const windows = BrowserWindow.getAllWindows()
  const win = windows.find((w) => w?.title === 'Vite App')
  win?.webContents?.send('fromMain', { event: 'json-diff', data: diff })
}
module.exports = { log, error, compareJsonSendToFrontend }
