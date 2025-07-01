// 注入 inject.js 到页面上下文
const script = document.createElement('script')
script.src = chrome.runtime.getURL('inject.js')
script.onload = () => script.remove()
;(document.head || document.documentElement).appendChild(script)

// 将来自 background 的请求记录转发给 inject.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'log-update') {
    window.postMessage({ source: 'web-request-float', type: 'log', data: message.payload }, '*')
  }
})

function initToolsPanel() {
  if (window.__VAR_PANEL_LOADED__) return
  window.__VAR_PANEL_LOADED__ = true

  const panel = document.createElement('div')
  panel.style.cssText = `
    position: fixed;
    top: 60px;
    left: 20px;
    width: 240px;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    padding: 10px;
    font-size: 12px;
    z-index: 999999;
    border-radius: 6px;
  `

  panel.innerHTML = `
  <button  data-method="getUserInfo1" data-expression="$('h1').text()">获取标题文本（jQuery）</button>
    <div style="font-weight:bold; margin-bottom: 6px;">$tools 快捷操作</div>
    <button data-method="getUserInfo" style="width:100%;margin-bottom:4px;">获取用户信息</button>
    <button data-method="highlight" style="width:100%;margin-bottom:4px;">高亮标题 (.main-title)</button>
    <button data-method="setStatus" style="width:100%;margin-bottom:4px;">设置状态为 active</button>
    <div id="tools-result" style="margin-top:10px;font-size:12px;background:#f9f9f9;border:1px solid #ccc;padding:8px;white-space:pre-wrap;max-height:200px;overflow:auto;"></div>
    <button id="close-btn" style="margin-top:6px; width:100%; background:#eee; padding:4px;">关闭浮窗</button>
  `

  const container = document.body || document.documentElement || document.head
  if (!container) {
    console.warn('页面结构不完整，无法注入浮窗')
    return
  }
  container.appendChild(panel)

  const resultDiv = panel.querySelector('#tools-result')
  const closeBtn = panel.querySelector('#close-btn')

  // 为每个按钮绑定事件
  panel.querySelectorAll('button[data-method]').forEach((btn) => {
    btn.onclick = () => {
      const method = btn.getAttribute('data-method')
      const args =
        method === 'highlight' ? ['.main-title'] : method === 'setStatus' ? ['active'] : []

      // chrome.runtime.sendMessage({
      //   action: 'inject-variable-script',
      //   expression: `$tools['${method}'](...${JSON.stringify(args)})`,
      // })

      const expr = btn.getAttribute('data-expression')
      if (expr) {
        chrome.runtime.sendMessage({
          action: 'inject-variable-script',
          expression: expr,
        })
      }
    }
  })

  // 接收执行结果
  window.addEventListener('message', (event) => {
    if (event.source !== window) return
    if (event.data.type === 'FROM_PAGE') {
      resultDiv.textContent = event.data.success
        ? '✅ ' + event.data.value
        : '❌ 错误：' + event.data.value
    }
  })

  closeBtn.onclick = () => panel.remove()
}

// 等待 DOM 可用后注入浮窗
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initToolsPanel)
} else {
  initToolsPanel()
}



async function pickColor() {
  try {
    const eyeDropper = new EyeDropper()
    const result = await eyeDropper.open()
    console.log('取到的颜色:', result.sRGBHex)
    alert(`你选择的颜色是：${result.sRGBHex}`)
  } catch (e) {
    console.warn('取色取消', e)
  }
}