document.addEventListener('DOMContentLoaded', () => {
  const pickBtn = document.getElementById('startPick')
  const cookieBtn = document.getElementById('getCookie')
  const display = document.getElementById('cookieDisplay')
  const toast = document.getElementById('toast')

  if (pickBtn) {
    pickBtn.onclick = async () => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tabs[0]?.id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['popup.js'],
        })
      }
    }
  }

  if (cookieBtn) {
    cookieBtn.onclick = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      chrome.cookies.getAll({ url: tab.url }, (cookies) => {
        const output = cookies.map((c) => `${c.name}=${c.value}`).join('; \n')
        if (display) {
          display.textContent = output
        }
      })
    }
  }

  if (display) {
    display.onclick = () => {
      const text = display.textContent
      if (!text) return

      navigator.clipboard.writeText(text).then(() => {
        toast.style.display = 'block'
        setTimeout(() => {
          toast.style.display = 'none'
          window.close()
        }, 1500)
      })
    }
  }
})

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
