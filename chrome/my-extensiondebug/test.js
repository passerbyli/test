// 插件脚本注入后执行
function bindElInputFocusListener() {
  // Element Plus 实际是一个包含 input 的组件
  const inputs = document.querySelectorAll('.el-input__inner')
  inputs.forEach((input) => {
    if (!input._hasFocusListener) {
      input.addEventListener('focus', (e) => {
        console.log('[插件] el-input 获得焦点:', e.target)
        // 你可以在这里做更多事，比如弹窗、浮窗、提示
      })
      input._hasFocusListener = true // 避免重复绑定
    }
  })
}

// 初次绑定
bindElInputFocusListener()

// 使用 MutationObserver 监听新增的 el-input
const observer = new MutationObserver(() => {
  bindElInputFocusListener()
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})
