;(function () {
  const logs = []

  const container = document.createElement('div')
  container.id = 'webrequest-float'
  container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 400px;
      max-height: 500px;
      overflow-y: auto;
      background: rgba(0,0,0,0.85);
      color: #00ffcc;
      font-size: 12px;
      padding: 8px;
      z-index: 9999999;
      border-radius: 6px;
      font-family: monospace;
    `

  const header = document.createElement('div')
  header.innerHTML = `
      <div style="margin-bottom:6px;">
        <b>请求记录</b>
        <input id="xhr-filter" placeholder="关键字过滤 URL..." style="width: 100%; font-size: 12px; margin-top: 4px;" />
      </div>
    `

  const list = document.createElement('div')
  list.id = 'xhr-log-list'

  container.appendChild(header)
  container.appendChild(list)

  let filterText = ''

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(container)
    document.getElementById('xhr-filter').addEventListener('input', (e) => {
      filterText = e.target.value.toLowerCase()
      render()
    })
    renderInitial()
  })

  window.addEventListener('message', (event) => {
    if (event.source !== window) return
    if (event.data?.source === 'web-request-float' && event.data.type === 'log') {
      logs.push(event.data.data)
      render()
    }
  })

  function render() {
    const filtered = logs
      .filter((log) => log.url.toLowerCase().includes(filterText))
      .slice(-100)
      .reverse()

    const html = filtered
      .map(
        (log) => `
        <div style="margin-bottom:6px;border-bottom:1px dashed #555;">
          <b>[${log.type}]</b> ${log.method} <code>${log.url}</code><br/>
          <small>${log.statusCode} - ${log.time}</small>
        </div>
      `
      )
      .join('')

    list.innerHTML = html || '<i>无匹配请求</i>'
  }

  function renderInitial() {
    chrome.storage?.local.get?.({ webLogs: [] }, (data) => {
      logs.push(...data.webLogs)
      render()
    })
  }
})()
