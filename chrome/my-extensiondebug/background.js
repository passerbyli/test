chrome.webRequest.onCompleted.addListener(
  (details) => {
    const { method, url, tabId, type, timeStamp, statusCode } = details
    const log = {
      method,
      url,
      type,
      statusCode,
      time: new Date(timeStamp).toLocaleTimeString(),
    }

    chrome.storage.local.get({ webLogs: [] }, (data) => {
      const logs = data.webLogs
      if (log.method == 'POST') {
        logs.push(log)
      }
      if (logs.length > 1000) logs.shift()
      chrome.storage.local.set({ webLogs: logs })
      if (log.method == 'POST') {
        if (tabId >= 0) {
          // 通知 content-script 更新浮窗
          chrome.tabs.sendMessage(
            tabId,
            {
              type: 'log-update',
              payload: log,
            },
            () => chrome.runtime.lastError
          ) // 避免 tab 不存在时报错
        }
      }
    })

    // 保存记录到以 tabId 为 key 的结构
    chrome.storage.local.get({ tabLogs: {} }, (data) => {
      const logsByTab = data.tabLogs
      if (!logsByTab[tabId]) logsByTab[tabId] = []
      logsByTab[tabId].push(log)
      if (logsByTab[tabId].length > 1000) logsByTab[tabId].shift()

      chrome.storage.local.set({ tabLogs: logsByTab })
    })
  },
  { urls: ['<all_urls>'] }
)

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('page.html'),
  })
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'inject-variable-script' && msg.expression && sender.tab?.id) {
    console.log('-----')
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const result = window.$('h1').text()
        console.log(result)
        window.postMessage({ type: 'FROM_PAGE', value: result }, '*')
      },
      world: 'MAIN',
    })
    sendResponse({ ok: true })
  }
})