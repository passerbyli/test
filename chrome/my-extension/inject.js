;(function () {
  const container = document.createElement('div')
  container.id = 'xhr-float-window'
  container.style.cssText = `
      position: fixed; top: 20px; right: 20px; width: 400px; background: rgba(0,0,0,0.85);
      color: #00ffcc; font-size: 12px; padding: 8px; z-index: 9999999;
      border-radius: 6px; font-family: monospace; max-height: 500px; overflow-y: auto;
    `

  const controls = document.createElement('div')
  controls.style.cssText =
    'display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;'
  controls.innerHTML = `
      <input id="xhr-filter" placeholder="Filter URL" style="flex:1; margin-right:4px; font-size:12px;" />
      <button style="color:#fff;" id="xhr-toggle">折叠</button>
      <button  style="color:#fff;" id="xhr-close">关闭</button>
    `

  const list = document.createElement('div')
  list.id = 'xhr-log-list'

  container.appendChild(controls)
  container.appendChild(list)
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(container)

    // 绑定事件，此时元素已在 DOM 中
    document.getElementById('xhr-toggle').onclick = () => {
      isCollapsed = !isCollapsed
      list.style.display = isCollapsed ? 'none' : 'block'
    }

    document.getElementById('xhr-close').onclick = () => {
      container.remove()
    }

    document.getElementById('xhr-filter').oninput = () => {
      const keyword = document.getElementById('xhr-filter').value.toLowerCase()
      renderLogs(keyword)
    }
  })

  let isCollapsed = false
  const logs = []



  function renderLogs(filter = '') {
    list.innerHTML = ''
    logs
      .filter((item) => item.url.toLowerCase().includes(filter))
      .forEach((item) => {
        const div = document.createElement('div')
        div.style.borderBottom = '1px dashed #555'
        div.style.marginBottom = '6px'
        div.innerHTML = `
            <div><b>[${item.type.toUpperCase()}]</b> <code>${item.method}</code> ${item.url}</div>
            <details><summary>详情</summary>
            <pre><b>Req:</b> ${item.reqBody || ''}\n<b>Res:</b> ${item.resBody || ''}</pre>
            </details>
          `
        list.appendChild(div)
      })
  }

  const originalFetch = window.fetch
  window.fetch = async function (...args) {
    const [input, init] = args
    const url = typeof input === 'string' ? input : input.url
    const method = (init && init.method) || 'GET'
    const body = (init && init.body) || ''

    try {
      const res = await originalFetch(...args)
      const clone = res.clone()
      clone.text().then((text) => {
        const item = {
          type: 'fetch',
          method,
          url,
          reqBody: typeof body === 'string' ? body : JSON.stringify(body),
          resBody: text.slice(0, 500),
        }
        logs.push(item)
        renderLogs(document.getElementById('xhr-filter').value.toLowerCase())
        if (logs.length > 1000) logs.shift()

        // ⬇️ 保存到 chrome.storage
        window.postMessage({ source: 'xhr-logger', type: 'save-log', payload: item }, '*')
      })
      return res
    } catch (e) {
      return originalFetch(...args)
    }
  }
})()
