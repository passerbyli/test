document.getElementById('queryBtn').addEventListener('click', async () => {
  const url = document.getElementById('apiUrl').value
  const output = document.getElementById('responseBox')
  output.value = '请求中...'

  try {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include', // ⬅️ 携带 Cookie
    })

    const text = await res.text()

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
