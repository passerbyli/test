;(function () {
  const originalFetch = window.fetch
  const originalXHR = window.XMLHttpRequest

  // 安全序列化请求体
  function safeBody(body) {
    if (body instanceof FormData) {
      const result = {}
      for (const [key, value] of body.entries()) {
        result[key] = value instanceof File ? `[File: ${value.name}]` : value
      }
      return result
    } else if (typeof body === 'object' && body !== null) {
      try {
        return JSON.stringify(body)
      } catch {
        return '[Unserializable Object]'
      }
    } else if (typeof body === 'string') {
      return body
    } else if (body === undefined || body === null) {
      return ''
    }
    return String(body)
  }

  function hookFetch() {
    window.fetch = async function (...args) {
      const [url, options = {}] = args
      const method = options.method || 'GET'
      const body = options.body
      const start = Date.now()

      try {
        const response = await originalFetch(...args)
        const clone = response.clone()
        const text = await clone.text()
        const headers = {}
        clone.headers.forEach((v, k) => (headers[k] = v))

        window.postMessage(
          {
            type: 'X_REQUEST_LOG',
            data: {
              method,
              url,
              requestBody: safeBody(body),
              status: response.status,
              responseText: text,
              headers,
              responseType: 'fetch',
              duration: Date.now() - start,
            },
          },
          '*'
        )
        return response
      } catch (e) {
        window.postMessage(
          {
            type: 'X_REQUEST_LOG',
            data: {
              method,
              url,
              requestBody: safeBody(body),
              status: 0,
              responseText: `[Fetch Error] ${e.message}`,
              headers: {},
              responseType: 'fetch',
              duration: Date.now() - start,
            },
          },
          '*'
        )
        throw e
      }
    }
  }

  function hookXHR() {
    const open = originalXHR.prototype.open
    const send = originalXHR.prototype.send

    originalXHR.prototype.open = function (method, url) {
      this._reqInfo = { method, url, start: Date.now() }
      return open.apply(this, arguments)
    }

    originalXHR.prototype.send = function (body) {
      const xhr = this
      this._reqInfo.body = body

      xhr.addEventListener('loadend', function () {
        const { method, url, start, body } = xhr._reqInfo
        let responseText = ''
        try {
          if (xhr.responseType === '' || xhr.responseType === 'text') {
            responseText = xhr.responseText
          } else {
            responseText = `[responseType=${xhr.responseType}]`
          }
        } catch (e) {
          responseText = `[XHR Error] ${e.message}`
        }

        window.postMessage(
          {
            type: 'X_REQUEST_LOG',
            data: {
              method,
              url,
              requestBody: safeBody(body),
              status: xhr.status,
              responseText,
              headers: xhr.getAllResponseHeaders(),
              responseType: xhr.responseType || 'default',
              duration: Date.now() - start,
            },
          },
          '*'
        )
      })

      return send.apply(this, arguments)
    }
  }

  hookFetch()
  hookXHR()
})()
