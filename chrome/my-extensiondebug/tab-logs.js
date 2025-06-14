let allTabs = []
let tabLogs = {}
let activeTabId = null

function renderTabs() {
  const headers = document.getElementById('tabHeaders')
  headers.innerHTML = ''
  allTabs.forEach((tab) => {
    const tabBtn = document.createElement('div')
    tabBtn.className = 'tab' + (tab.id === activeTabId ? ' active' : '')
    tabBtn.textContent = tab.title?.substring(0, 20) || `Tab ${tab.id}`
    tabBtn.onclick = () => {
      activeTabId = tab.id
      renderTabs()
      renderTabContent()
    }
    headers.appendChild(tabBtn)
  })
}

function renderTabContent() {
  const container = document.getElementById('tabContent')
  const tab = allTabs.find((t) => t.id === activeTabId)
  const logs = tabLogs[activeTabId] || []

  if (!tab) {
    container.innerHTML = '<i>无正在活动的标签页</i>'
    return
  }

  const logHtml =
    logs.length === 0
      ? '<i>暂无请求记录</i>'
      : logs
          .slice(-20)
          .reverse()
          .map(
            (log) => `
      <div class="log-entry">
        [${log.type}] ${log.method} <code>${log.url}</code><br/>
        <small>Status: ${log.statusCode} • Time: ${log.time}</small>
      </div>
    `
          )
          .join('')

  container.innerHTML = `
    <p><b>Tab ID:</b> ${tab.id}</p>
    <p><b>URL:</b> ${tab.url}</p>
    <button class="clear-btn" onclick="clearTabLogs(${tab.id})">清空记录</button>
    ${logHtml}
  `
}

function clearTabLogs(tabId) {
  chrome.storage.local.get({ tabLogs: {} }, (data) => {
    delete data.tabLogs[tabId]
    chrome.storage.local.set({ tabLogs: data.tabLogs }, () => {
      tabLogs = data.tabLogs
      renderTabContent()
    })
  })
}

function loadTabLogs() {
  chrome.tabs.query({}, (tabs) => {
    allTabs = tabs
    if (!activeTabId && allTabs.length > 0) activeTabId = allTabs[0].id

    chrome.storage.local.get({ tabLogs: {} }, (data) => {
      tabLogs = data.tabLogs
      renderTabs()
      renderTabContent()
    })
  })
}

loadTabLogs()
setInterval(loadTabLogs, 3000)
