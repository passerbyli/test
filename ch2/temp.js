let cachePopup = null // 单独保存“清理缓存”浮窗的引用
let popupTimeout = null // 用于控制浮窗隐藏的定时器

// 显示“清理缓存”浮窗
function showCachePopup(button) {
  // 关闭现有的“清理缓存”浮窗（如果存在）
  if (cachePopup) {
    cachePopup.remove()
  }

  // 克隆模板并显示
  const popup = document.getElementById('popup-template').cloneNode(true)
  popup.id = 'cache-popup' // 设置特定ID用于标识“清理缓存”浮窗
  popup.style.display = 'block'
  popup.querySelector('.popup-header span').innerText = '清理缓存'

  // 生成缓存清理按钮
  let cacheButtons = ['清理缓存1', '清理缓存2', '清理缓存3']
    .map(
      (item, index) =>
        `<button class="cache-btn" onclick="clearCache(this, '缓存${index + 1}')">${item}</button>`
    )
    .join('')
  popup.querySelector('.popup-content').innerHTML = cacheButtons

  document.body.appendChild(popup)

  // 定位在按钮正上方
  const rect = button.getBoundingClientRect()
  popup.style.top = rect.top - popup.offsetHeight + 'px'
  popup.style.left = rect.left + 'px'

  // 保存当前的“清理缓存”浮窗引用
  cachePopup = popup

  // 添加“清理缓存”浮窗的移出事件监听器
  cachePopup.addEventListener('mouseleave', hideCachePopupWithDelay)
}

// 隐藏“清理缓存”浮窗
function hideCachePopupWithDelay() {
  popupTimeout = setTimeout(() => {
    if (cachePopup) {
      cachePopup.remove()
      cachePopup = null
    }
  }, 300) // 延迟300毫秒隐藏，避免误操作
}

// 鼠标移入“清理缓存”按钮时显示浮窗
document.getElementById('clear-cache-btn').onmouseenter = function () {
  clearTimeout(popupTimeout) // 清除之前的隐藏定时器，防止误操作
  showCachePopup(this)
}

// 鼠标移出“清理缓存”按钮时，启动延迟隐藏浮窗逻辑
document.getElementById('clear-cache-btn').onmouseleave = function () {
  hideCachePopupWithDelay()
}

// 清除缓存功能的逻辑
function clearCache(button, cacheName) {
  button.innerText = '清理中...'
  setTimeout(() => {
    button.innerText = `${cacheName} 已清理`
    button.disabled = true
  }, 2000) // 模拟 2 秒清理时间
}

// 其他弹窗逻辑依旧保持不变
// 例如，查看基础信息或查看模型关系的浮窗等不受此影响
