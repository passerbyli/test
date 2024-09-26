let isGridVisible = false;
let guides = [];

// 监听来自 background.js 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggleGrid !== undefined) {
    toggleGrid(request.toggleGrid);
  }
});

// 切换标尺和删格
function toggleGrid(show) {
  isGridVisible = show;
  if (isGridVisible) {
    showGrid();
  } else {
    removeGrid();
  }
}

// 显示标尺和删格
function showGrid() {
  // 添加删格背景
  const gridBackground = document.createElement("div");
  gridBackground.id = "grid-background";
  gridBackground.style.position = "fixed";
  gridBackground.style.top = "0";
  gridBackground.style.left = "0";
  gridBackground.style.width = "100vw";
  gridBackground.style.height = "100vh";
  gridBackground.style.backgroundSize = "20px 20px";
  gridBackground.style.backgroundImage =
    "linear-gradient(to right, #e0e0e0 1px, transparent 1px), linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)";
  gridBackground.style.zIndex = "9999";
  document.body.appendChild(gridBackground);

  // 添加水平标尺
  const rulerHorizontal = document.createElement("div");
  rulerHorizontal.id = "ruler-horizontal";
  rulerHorizontal.style.position = "fixed";
  rulerHorizontal.style.top = "0";
  rulerHorizontal.style.left = "0";
  rulerHorizontal.style.width = "100%";
  rulerHorizontal.style.height = "20px";
  rulerHorizontal.style.background = "lightgray";
  rulerHorizontal.style.zIndex = "10000";
  document.body.appendChild(rulerHorizontal);

  // 添加垂直标尺
  const rulerVertical = document.createElement("div");
  rulerVertical.id = "ruler-vertical";
  rulerVertical.style.position = "fixed";
  rulerVertical.style.top = "0";
  rulerVertical.style.left = "0";
  rulerVertical.style.height = "100%";
  rulerVertical.style.width = "20px";
  rulerVertical.style.background = "lightgray";
  rulerVertical.style.zIndex = "10000";
  document.body.appendChild(rulerVertical);

  drawRulerTicks(rulerHorizontal, "horizontal");
  drawRulerTicks(rulerVertical, "vertical");
  addRulerListeners();
}

// 移除删格和标尺
function removeGrid() {
  document.getElementById("grid-background")?.remove();
  document.getElementById("ruler-horizontal")?.remove();
  document.getElementById("ruler-vertical")?.remove();
  guides.forEach((guide) => guide.remove());
  guides = [];
}

// 绘制标尺刻度
function drawRulerTicks(ruler, direction) {
  const isHorizontal = direction === "horizontal";
  const length = isHorizontal ? window.innerWidth : window.innerHeight;

  for (let i = 0; i < length; i += 10) {
    const tick = document.createElement("div");
    tick.className = "ruler-tick " + (i % 50 === 0 ? "long" : "short");
    if (isHorizontal) {
      tick.style.position = "absolute";
      tick.style.left = `${i}px`;
      tick.style.height = "100%";
      tick.style.width = i % 50 === 0 ? "6px" : "3px";
      tick.style.backgroundColor = "black";
    } else {
      tick.style.position = "absolute";
      tick.style.top = `${i}px`;
      tick.style.width = "100%";
      tick.style.height = i % 50 === 0 ? "6px" : "3px";
      tick.style.backgroundColor = "black";
    }
    ruler.appendChild(tick);
  }
}

// 监听标尺的拖动
function addRulerListeners() {
  const rulerHorizontal = document.getElementById("ruler-horizontal");
  const rulerVertical = document.getElementById("ruler-vertical");
  let isDragging = false;
  let currentGuide = null;

  // 在水平标尺上拖动鼠标创建水平刻度线
  rulerHorizontal.addEventListener("mousedown", (e) => {
    isDragging = true;
    currentGuide = document.createElement("div");
    currentGuide.className = "guide-line guide-horizontal";
    currentGuide.style.position = "absolute";
    currentGuide.style.width = `${document.documentElement.scrollWidth}px`;
    currentGuide.style.top = `${e.clientY + window.scrollY}px`;
    currentGuide.style.height = "1px";
    currentGuide.style.backgroundColor = "red";
    document.body.appendChild(currentGuide);
  });

  // 在垂直标尺上拖动鼠标创建垂直刻度线
  rulerVertical.addEventListener("mousedown", (e) => {
    isDragging = true;
    currentGuide = document.createElement("div");
    currentGuide.className = "guide-line guide-vertical";
    currentGuide.style.position = "absolute";
    currentGuide.style.height = `${document.documentElement.scrollHeight}px`;
    currentGuide.style.left = `${e.clientX + window.scrollX}px`;
    currentGuide.style.width = "1px";
    currentGuide.style.backgroundColor = "red";
    document.body.appendChild(currentGuide);
  });

  // 监听鼠标移动事件
  document.addEventListener("mousemove", (e) => {
    if (isDragging && currentGuide) {
      if (currentGuide.classList.contains("guide-horizontal")) {
        currentGuide.style.top = `${e.clientY + window.scrollY}px`;
      } else if (currentGuide.classList.contains("guide-vertical")) {
        currentGuide.style.left = `${e.clientX + window.scrollX}px`;
      }
    }
  });

  // 鼠标释放时，停止拖动
  document.addEventListener("mouseup", () => {
    isDragging = false;
    guides.push(currentGuide);
    currentGuide = null;
  });
}
