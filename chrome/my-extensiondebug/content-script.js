;;(function () {
  // 内部配置：可修改
  const floatingLoggerConfig = {
    urlRules: [
      { pattern: /api\//, captureResponseBody: false },
      { pattern: /com/, captureResponseBody: false },
      { pattern: /\/rcmd\//, captureResponseBody: false },
    ],
    maxLogs: 200,
  }
  // 注入配置文件
  const configScript = document.createElement('script')
  configScript.src = chrome.runtime.getURL('floating-config.js')
  configScript.onload = () => configScript.remove()
  document.documentElement.appendChild(configScript)

  // 注入样式
  function injectCss() {
    const styleId = 'floating-log-style'
    if (!document.getElementById(styleId)) {
      const link = document.createElement('link')
      link.id = styleId
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = chrome.runtime.getURL('floating-style.css')
      document.head.appendChild(link)
    }
  }

  if (document.head) {
    injectCss()
  } else {
    window.addEventListener('DOMContentLoaded', injectCss)
  }

  // 注入浮窗逻辑
  const uiScript = document.createElement('script')
  uiScript.src = chrome.runtime.getURL('floating-ui.js')
  uiScript.onload = () => uiScript.remove()
  document.documentElement.appendChild(uiScript)

  // 注入拦截逻辑
  const hookScript = document.createElement('script')
  hookScript.src = chrome.runtime.getURL('inject.js')
  hookScript.onload = () => hookScript.remove()
  document.documentElement.appendChild(hookScript)

  // 根据 URL 查找是否匹配规则
  function matchRule(url) {
    const rule = floatingLoggerConfig.urlRules?.find((r) => {
      try {
        return new RegExp(r.pattern).test(url)
      } catch {
        return false
      }
    })
    return rule || { captureResponseBody: false }
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window) return
    if (event.data?.type === 'X_REQUEST_LOG') {
      const data = event.data.data
      const rule = matchRule(data.url)
      if (!rule) return

      try {
        chrome.runtime.sendMessage({ type: 'log', data })
        const compacted = compactLog(data, rule)
        chrome.storage.local.get({ logs: [] }, (result) => {
          const logs = [...result.logs, compacted]
          if (logs.length > floatingLoggerConfig.maxLogs) {
            logs.splice(0, logs.length - floatingLoggerConfig.maxLogs)
          }
          chrome.storage.local.set({ logs })
        })
        window.dispatchEvent(new CustomEvent('FLOATING_LOG_EVENT', { detail: data }))
      } catch (err) {
        console.error('[XHR Logger] sendMessage failed:', err)
      }
    }
  })

  function matchRule(url) {
    const rules = floatingLoggerConfig.urlRules || []
    if (rules.length === 0) return { captureResponseBody: false } // 默认不过滤
    return rules.find((r) => {
      try {
        return new RegExp(r.pattern).test(url)
      } catch {
        return false
      }
    })
  }

  function compactLog(log, rule) {
    const MAX_LEN = 2000
    return {
      ...log,
      requestBody: truncate(log.requestBody),
      responseText: rule.captureResponseBody ? truncate(log.responseText) : '[hidden]',
    }

    function truncate(v) {
      if (typeof v === 'string' && v.length > MAX_LEN) return v.slice(0, MAX_LEN) + '...'
      if (typeof v === 'object') {
        try {
          const str = JSON.stringify(v)
          return truncate(str)
        } catch {
          return '[Unserializable]'
        }
      }
      return v
    }
  }
})()






function addIconsToTree() {
  // 遍历每一个树节点
  document.querySelectorAll('.el-tree-node__content').forEach((node) => {
    if (node.querySelector('.custom-icon')) return // 避免重复插入

    const icon = document.createElement('span')
    icon.className = 'custom-icon'
    icon.innerHTML = '🌲' // 可以换成 FontAwesome 或 SVG
    icon.style.marginRight = '5px'

    // 插入到文本前
    const label = node.querySelector('.el-tree-node__label')
    if (label && label.parentNode) {
      label.parentNode.insertBefore(icon, label)
    }
  })
}

// 初始执行一次
addIconsToTree()

// 使用 MutationObserver 监听 DOM 变化
const treeContainer = document.querySelector('.el-tree')
if (treeContainer) {
  const observer = new MutationObserver(() => {
    addIconsToTree()
  })
  observer.observe(treeContainer, {
    childList: true,
    subtree: true,
  })
}