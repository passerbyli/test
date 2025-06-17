document.querySelectorAll('a[data-url]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const url = link.getAttribute('data-url')

    // 判断是否内部页
    const fullUrl = url.startsWith('http') ? url : chrome.runtime.getURL(url)

    chrome.tabs.create({ url: fullUrl })
    window.close() // 关闭 popup
  })
})

