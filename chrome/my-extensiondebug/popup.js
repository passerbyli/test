chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  chrome.runtime.sendMessage({ type: 'getLogs', tabId: tab.id })
})

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'log-update') {
    const ul = document.getElementById('log-list')
    ul.innerHTML = ''
    msg.data.forEach((log) => {
      const li = document.createElement('li')
      li.textContent = `${log.method} ${log.url} [${log.status}]`
      ul.appendChild(li)
    })
  }
})
