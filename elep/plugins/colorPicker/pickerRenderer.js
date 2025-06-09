const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// 获取截图并画到 canvas
window.electronAPI.getScreenshot().then((imgDataUrl) => {
  const img = new Image()
  img.onload = () => ctx.drawImage(img, 0, 0)
  img.src = imgDataUrl
})

const colorBox = document.getElementById('color-box')
const crosshair = document.getElementById('crosshair')

console.log('0----xxxx-')
document.addEventListener('mousemove', (e) => {
  const x = e.clientX
  const y = e.clientY

  const pixel = ctx.getImageData(x, y, 1, 1).data
  const hex = `#${[pixel[0], pixel[1], pixel[2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`

  // 更新参考线
  crosshair.style.left = `${x}px`
  crosshair.style.top = `${y}px`

  // 显示颜色信息
  colorBox.style.left = `${x + 10}px`
  colorBox.style.top = `${y + 10}px`
  colorBox.style.backgroundColor = hex
  colorBox.textContent = `${hex} (${x},${y})`
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') window.electronAPI.closePicker()
})
document.addEventListener('mousedown', () => {
  window.electronAPI.closePicker()
})
