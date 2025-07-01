chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  chrome.runtime.sendMessage({ type: 'getLogs', tabId: tab.id })
})

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'log-update') {
    const ul = document.getElementById('request-log')
    ul.innerHTML = ''
    msg.data.forEach((log) => {
      const li = document.createElement('li')
      li.textContent = `[${log.method}] ${log.url} - ${log.status} (${log.duration}ms)`
      ul.appendChild(li)
    })
  }
})


chrome.storage.local.get({ logs: [] }, (result) => {
  const ul = document.getElementById('request-log')
  result.logs.forEach((log) => {
    const li = document.createElement('li')
    li.textContent = `[${log.method}] ${log.url} - ${log.status} (${log.duration}ms)`
    ul.appendChild(li)
  })
})