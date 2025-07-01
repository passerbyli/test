let logCache = {}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'log') {
    const tabId = sender.tab?.id
    if (!tabId) return
    if (!logCache[tabId]) logCache[tabId] = []
    logCache[tabId].push(msg.data)
  }

  if (msg.type === 'getLogs') {
    const tabId = msg.tabId
    chrome.runtime.sendMessage({ type: 'log-update', data: logCache[tabId] || [] })
  }
})

chrome.tabs.onRemoved.addListener((tabId) => {
  delete logCache[tabId]
})
