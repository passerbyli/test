let currentPopup = null // 当前弹窗
let previousContent = null // 保存上一级内容

var time1 = undefined
// 模拟加载数据
window.onload = function () {
  updateHiddenElementCount()
}

/**
 * 更新隐藏元素数量
 */
function updateHiddenElementCount() {
  const hiddenElements = document.querySelectorAll('[style*="display: none"], [hidden]')
  document.getElementById('hidden-elements-count').innerText = '隐藏元素: ' + hiddenElements.length
}

/**
 * 显示浮窗，确保同时只能有一个弹窗
 * @param {*} button
 * @param {*} title 标题
 * @param {*} content 显示内容
 * @param {Boolean} isLoading 弹窗状态
 * @param {Boolean} showBack 是否显示返回按钮
 */
function showPopup(button, title, content, isLoading = false, showBack = false) {
  // 关闭现有弹窗
  if (currentPopup) {
    currentPopup.remove()
  }

  // 克隆模板并显示
  const popup = document.getElementById('popup-template').cloneNode(true)
  popup.id = ''
  popup.style.display = 'block'
  popup.querySelector('.popup-header span').innerText = title
  popup.querySelector('.popup-content').innerHTML = isLoading ? '加载中...' : content

  // 是否显示“返回”按钮
  if (showBack) {
    popup.querySelector('.back-btn').style.display = 'block'
  } else {
    popup.querySelector('.back-btn').style.display = 'none'
  }

  document.body.appendChild(popup)

  // 定位在按钮正上方
  const rect = button.getBoundingClientRect()
  popup.style.top = rect.top - popup.offsetHeight - 30 + 'px'
  popup.style.left = rect.left + 'px'

  // 保存当前弹窗引用
  currentPopup = popup
}

/**
 * 关闭浮窗
 * @param {*} button
 */
function closePopup(button) {
  button.closest('.popup').remove()
  currentPopup = null
}

// 模拟 API 请求
function requestApi(apiName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        `<h1>返回的 ${apiName} 数据</h1><h1>返回的 ${apiName} 数据</h1><h1>返回的 ${apiName} 数据</h1><h1>返回的 ${apiName} 数据</h1>`
      )
    }, 2000) // 模拟 2 秒延迟
  })
}

// 查看基础信息
document.getElementById('basic-info-btn').onmouseenter = async function () {
  // showPopup(this, '基础信息', '', true) // 显示加载中
  const content = await requestApi('api1')
  showPopup(this, '基础信息', content) // 加载完成后更新内容
}
document.getElementById('basic-info-btn').onmouseleave = async function () {
  time1 = setTimeout(function () {
    if (currentPopup) {
      currentPopup.remove()
    }
  }, 200)
}
// 清理缓存
document.getElementById('clear-cache-btn').onclick = function () {
  let cacheButtons = ['清理缓存1', '清理缓存2', '清理缓存3']
    .map(
      (item, index) =>
        `<button class="toolbar-btn cache-btn" onclick="clearCache(this, '缓存${index + 1}')">${item}</button>`
    )
    .join('')
  showPopup(this, '清理缓存', cacheButtons)
}

/**
 * 清理缓存逻辑
 * @param {*} button
 * @param {*} cacheName
 */
function clearCache(button, cacheName) {
  button.innerText = '清理中...'
  setTimeout(() => {
    button.innerText = `${cacheName} 已清理`
    button.disabled = true
  }, 2000) // 模拟 2 秒清理时间
}

// 查看模型关系
document.getElementById('model-relation-btn').onclick = async function () {
  showPopup(this, '模型关系', '', true) // 显示加载中
  const content = await requestApi('api2')
  showPopup(this, '模型关系', content) // 加载完成后更新内容
}

// 查看元素使用
document.getElementById('element-usage-btn').onclick = function () {
  previousContent = getElementsUsage() // 保存上一级内容
  showPopup(this, '元素使用', previousContent)
}

/**
 * 获取页面 HTML 元素的使用统计
 * @returns
 */
function getElementsUsage() {
  const tags = [...document.querySelectorAll('*')].reduce((acc, el) => {
    const tag = el.tagName.toLowerCase()
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {})

  let table = `<table>
                  <tr>
                    <th>元素标签</th>
                    <th>使用次数</th>
                  </tr>`
  for (let tag in tags) {
    table += `<tr>
                <td>${tag}</td>
                <td><a href="#" onclick="drillDown('${tag}')">${tags[tag]}</a></td>
              </tr>`
  }
  table += '</table>'
  return table
}

/**
 * 下钻显示具体的元素详情
 * @param {*} tag
 */
function drillDown(tag) {
  const elements = [...document.querySelectorAll(tag)]
  let table = `<table>
                <tr>
                  <th>标签</th>
                  <th>ID</th>
                  <th>Class</th>
                  <th>是否隐藏</th>
                </tr>`

  elements.forEach((el, index) => {
    const isHidden = window.getComputedStyle(el).display === 'none' ? '是' : '否'
    table += `
    <tr>
      <td>${tag}</td>
      <td>${el.id || '无'}</td>
      <td>${el.className || '无'}</td>
      <td><a href="#" onclick="toggleVisibility(this, ${index})">${isHidden}</a></td>
    </tr>`
  })
  table += '</table>'
  previousContent = currentPopup.querySelector('.popup-content').innerHTML // 保存当前内容
  currentPopup.querySelector('.popup-content').innerHTML = table
  currentPopup.querySelector('.back-btn').style.display = 'block' // 显示返回按钮
}

/**
 * 返回上一级
 */
function goBack() {
  currentPopup.querySelector('.popup-content').innerHTML = previousContent
  currentPopup.querySelector('.back-btn').style.display = 'none' // 隐藏返回按钮
}

/**
 * 切换元素的可见性并高亮显示
 * @param {*} link
 * @param {*} index
 */
function toggleVisibility(link, index) {
  const tag = link.closest('tr').querySelector('td').innerText
  const element = document.querySelectorAll(tag)[index]
  if (window.getComputedStyle(element).display === 'none') {
    element.style.display = ''
    element.classList.add('highlight')
    setTimeout(() => element.classList.remove('highlight'), 2000) // 2 秒后移除高亮
    link.innerText = '否'
  }
}

// 浮窗拖动功能
let offsetX, offsetY

function startDrag(e, element) {
  e.preventDefault()
  offsetX = e.clientX - element.closest('.popup').offsetLeft
  offsetY = e.clientY - element.closest('.popup').offsetTop

  document.onmousemove = function (e) {
    e.preventDefault()
    element.closest('.popup').style.left = e.clientX - offsetX + 'px'
    element.closest('.popup').style.top = e.clientY - offsetY + 'px'
  }

  document.onmouseup = function () {
    document.onmousemove = null
    document.onmouseup = null
  }
}

document.getElementById('arrow').onclick = function () {
  if (this.className.includes('right')) {
    this.className = 'arrow left'
  } else if (this.className.includes('left')) {
    this.className = 'arrow right'
  }
}

// document.getElementById('basic-info-btn').onmouseenter = function () {
//   document.getElementById('popup-template').style.display = 'block'
// }

// document.getElementById('basic-info-btn').onmouseleave = function () {
//   time1 = setTimeout(function () {
//     document.getElementById('popup-template').style.display = 'none'
//   }, 200)
// }
// document.getElementById('popup-template').onmouseenter = function () {
//   clearTimeout(time1)
// }
// document.getElementById('popup-template').onmouseleave = function () {
//   this.style.display = 'none'
// }
