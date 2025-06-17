document.getElementById('queryBtn').addEventListener('click', async () => {
  const url = document.getElementById('apiUrl').value
  const output = document.getElementById('responseBox')
  output.value = '请求中...'

  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include', // ⬅️ 携带浏览器 Cookie
    })
    const text = await res.text()

    // 尝试解析为 JSON，美化输出
    try {
      const json = JSON.parse(text)
      output.value = JSON.stringify(json, null, 2)
    } catch {
      output.value = text
    }
  } catch (err) {
    output.value = '请求失败：' + err.message
  }
})


const preview = document.createElement('div')
preview.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ccc;
  z-index: 999999;
`
document.body.appendChild(preview)

// 在 pickColor 中更新
preview.textContent = `选中的颜色：${result.sRGBHex}`
preview.style.borderColor = result.sRGBHex