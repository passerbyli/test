chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'save-log') {
    chrome.storage.local.get({ xhrLogs: [] }, (data) => {
      const logs = data.xhrLogs
      logs.push(message.payload)
      if (logs.length > 1000) logs.shift()
      chrome.storage.local.set({ xhrLogs: logs })
    })
  }
})


