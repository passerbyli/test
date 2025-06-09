const tabXHRMap = new Map() // tabId -> [ { url, method, reqBody, resBody, status } ]

const MAX_RECORDS = 1000

// 监听请求
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const { tabId, url, method, requestBody } = details
    if (tabId < 0 || !url.startsWith('http')) return

    const body = requestBody ? getRequestBody(requestBody) : null

    addRecord(tabId, {
      url,
      method,
      reqBody: body,
      resBody: null,
      status: null,
      time: new Date().toISOString(),
    })
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
)

// 监听响应
chrome.webRequest.onCompleted.addListener(
  async (details) => {
    const { tabId, url, statusCode } = details
    if (tabId < 0 || !url.startsWith('http')) return

    const records = tabXHRMap.get(tabId)
    if (!records) return

    const match = records.find((r) => r.url === url && r.status === null)
    if (match) {
      match.status = statusCode
      // 无法直接获取响应体（受限于 webRequest API），可在 content script 中 fetch + hook 实现
    }
  },
  { urls: ['<all_urls>'] },
  []
)

// 页签关闭时清除记录
chrome.tabs.onRemoved.addListener((tabId) => {
  tabXHRMap.delete(tabId)
})

// 添加记录
function addRecord(tabId, record) {
  if (!tabXHRMap.has(tabId)) {
    tabXHRMap.set(tabId, [])
  }
  const list = tabXHRMap.get(tabId)
  if (list.length >= MAX_RECORDS) {
    list.shift() // 移除最早的
  }
  list.push(record)
}

// 格式化请求体
function getRequestBody(requestBody) {
  if (!requestBody) return null
  if (requestBody.raw && requestBody.raw.length > 0) {
    try {
      const decoder = new TextDecoder('utf-8')
      return decoder.decode(requestBody.raw[0].bytes)
    } catch (e) {
      return '[raw body]'
    }
  }
  if (requestBody.formData) return requestBody.formData
  return null
}

// 提供 popup.js 查询数据使用
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'getTabRecords') {
    const tabId = msg.tabId
    const data = tabXHRMap.get(tabId) || []
    sendResponse(data)
  }
})
