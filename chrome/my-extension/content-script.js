const script = document.createElement('script')
script.src = chrome.runtime.getURL('inject.js')
script.onload = () => script.remove()
;(document.head || document.documentElement).appendChild(script)

// 新增监听来自页面的消息
window.addEventListener('message', (event) => {
  if (event.source !== window) return
  if (event.data && event.data.source === 'xhr-logger' && event.data.type === 'save-log') {
    chrome.runtime.sendMessage({
      type: 'save-log',
      payload: event.data.payload,
    })
  }
})



