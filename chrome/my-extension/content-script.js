;(function () {
  const MAX_RECORDS = 1000
  const xhrLog = []
  window.__xhrLogMap = xhrLog

  // 等待 body 加载
  function ensureBodyReady(callback) {
    if (document.body) {
      callback()
    } else {
      const observer = new MutationObserver(() => {
        if (document.body) {
          observer.disconnect()
          callback()
        }
      })
      observer.observe(document.documentElement, { childList: true, subtree: true })
    }
  }

  ensureBodyReady(() => {
    // 创建浮窗容器
    const container = document.createElement('div')
    container.id = 'xhr-float-window'
    document.body.appendChild(container)

    const logToWindow = (msg) => {
      const div = document.createElement('div')
      div.className = 'xhr-item'
      div.innerText = msg
      container.appendChild(div)
      if (container.childNodes.length > MAX_RECORDS) {
        container.removeChild(container.firstChild)
      }
    }

    setupInterceptors(logToWindow)
  })

  function setupInterceptors(logToWindow) {
    // ---- XMLHttpRequest 劫持 ----
    const OriginalXHR = window.XMLHttpRequest
    class InterceptedXHR extends OriginalXHR {
      constructor() {
        super()
        let url = '',
          method = '',
          body = ''

        this.addEventListener('readystatechange', function () {
          if (this.readyState === 4) {
            try {
              const resText = this.responseText.slice(0, 500) // 限制长度
              xhrLog.push({ type: 'xhr', method, url, reqBody: body, resBody: resText })
              logToWindow(`[XHR] ${method} ${url}`)
            } catch (e) {}
          }
        })

        const originalOpen = this.open
        this.open = function (...args) {
          method = args[0]
          url = args[1]
          originalOpen.apply(this, args)
        }

        const originalSend = this.send
        this.send = function (data) {
          body = typeof data === 'string' ? data : '[object]'
          originalSend.call(this, data)
        }
      }
    }
    window.XMLHttpRequest = InterceptedXHR

    // ---- fetch 劫持 ----
    const originalFetch = window.fetch
    window.fetch = async function (...args) {
      const [input, init] = args
      let url = typeof input === 'string' ? input : input.url
      let method = (init && init.method) || 'GET'
      let body = (init && init.body) || ''
console.log(url)
      try {
        const res = await originalFetch(...args)
        const clone = res.clone()
        clone.text().then((text) => {
          xhrLog.push({
            type: 'fetch',
            method,
            url,
            reqBody: body,
            resBody: text.slice(0, 500),
          })
          logToWindow(`[fetch] ${method} ${url}`)
        })
        return res
      } catch (e) {
        logToWindow(`[fetch-error] ${method} ${url}`)
        throw e
      }
    }
  }
})()
