let isGridActive = false;
let guides = [];

function toggleGrid() {
  if (isGridActive) {
    removeGrid();
  } else {
    showGrid();
  }
  isGridActive = !isGridActive;
}

function showGrid() {
  // 添加删格背景
  const gridBackground = document.createElement("div");
  gridBackground.id = "grid-background";
  document.body.appendChild(gridBackground);

  // 添加水平标尺
  const rulerHorizontal = document.createElement("div");
  rulerHorizontal.id = "ruler-horizontal";
  document.body.appendChild(rulerHorizontal);

  // 添加垂直标尺
  const rulerVertical = document.createElement("div");
  rulerVertical.id = "ruler-vertical";
  document.body.appendChild(rulerVertical);

  // 显示标尺刻度
  drawRulerTicks(rulerHorizontal, "horizontal");
  drawRulerTicks(rulerVertical, "vertical");

  // 监听点击标尺拖出刻度线
  addRulerListeners();

  // 适应窗口大小变化
  adjustRulerSize();
}

function removeGrid() {
  // 移除删格和标尺
  document.getElementById("grid-background")?.remove();
  document.getElementById("ruler-horizontal")?.remove();
  document.getElementById("ruler-vertical")?.remove();

  // 移除所有刻度线
  guides.forEach((guide) => guide.remove());
  guides = [];
}

function drawRulerTicks(ruler, direction) {
  const isHorizontal = direction === "horizontal";
  const length = isHorizontal ? window.innerWidth : window.innerHeight;

  for (let i = 0; i < length; i += 10) {
    const tick = document.createElement("div");
    tick.className = "ruler-tick " + (i % 50 === 0 ? "long" : "short");
    if (isHorizontal) {
      tick.style.left = `${i}px`;
    } else {
      tick.style.top = `${i}px`;
    }

    // 每50px显示数字
    if (i % 50 === 0) {
      const number = document.createElement("div");
      number.className = "ruler-number";
      number.innerText = i;

      if (isHorizontal) {
        number.style.left = `${i}px`;
        number.style.bottom = "0px"; // 水平标尺的数字在上方
      } else {
        number.style.top = `${i}px`;
        number.style.right = "0px"; // 垂直标尺的数字在左边
      }

      ruler.appendChild(number);
    }
    ruler.appendChild(tick);
  }
}

function addRulerListeners() {
  const rulerHorizontal = document.getElementById("ruler-horizontal");
  const rulerVertical = document.getElementById("ruler-vertical");
  let isDragging = false; // 是否正在拖动
  let currentGuide = null; // 当前正在拖动的刻度线

  // 在水平标尺上拖动鼠标创建水平刻度线
  rulerHorizontal.addEventListener("mousedown", (e) => {
    e.preventDefault(); // 防止拖动时出现选中文本
    isDragging = true;
    currentGuide = document.createElement("div");
    currentGuide.className = "guide-line guide-horizontal";
    currentGuide.style.width = `${document.documentElement.scrollWidth}px`; // 设置水平线的宽度覆盖整个页面
    document.body.appendChild(currentGuide);
    updateGuidePosition(
      currentGuide,
      e.clientY + window.scrollY - 20,
      "horizontal"
    ); // 初始位置，包含垂直滚动偏移
  });

  // 在垂直标尺上拖动鼠标创建垂直刻度线
  rulerVertical.addEventListener("mousedown", (e) => {
    e.preventDefault(); // 防止拖动时出现选中文本
    isDragging = true;
    currentGuide = document.createElement("div");
    currentGuide.className = "guide-line guide-vertical";
    currentGuide.style.height = `${document.documentElement.scrollHeight}px`; // 设置垂直线的高度覆盖整个页面
    currentGuide.style.top = "0"; // 从页面顶部开始
    document.body.appendChild(currentGuide);
    updateGuidePosition(
      currentGuide,
      e.clientX + window.scrollX - 20,
      "vertical"
    ); // 初始位置，包含水平滚动偏移
  });

  // 监听全局鼠标移动事件，更新刻度线的位置
  document.addEventListener("mousemove", (e) => {
    if (isDragging && currentGuide) {
      e.preventDefault(); // 防止拖动时选中文本
      if (currentGuide.classList.contains("guide-horizontal")) {
        // 更新水平线位置，包含页面滚动的偏移
        updateGuidePosition(
          currentGuide,
          e.clientY + window.scrollY - 20,
          "horizontal"
        );
      } else if (currentGuide.classList.contains("guide-vertical")) {
        // 更新垂直线位置，包含页面滚动的偏移
        updateGuidePosition(
          currentGuide,
          e.clientX + window.scrollX - 20,
          "vertical"
        );
      }
    }
  });

  // 当鼠标释放时，结束拖动
  document.addEventListener("mouseup", (e) => {
    if (isDragging) {
      e.preventDefault(); // 防止释放时选中文本
      isDragging = false;
      guides.push(currentGuide); // 保存拖出的刻度线
      currentGuide = null; // 清空当前刻度线
    }
  });
}

// 更新刻度线位置的辅助函数
function updateGuidePosition(guide, position, direction) {
  if (direction === "horizontal") {
    guide.style.top = `${position}px`; // 直接使用页面全局坐标
  } else if (direction === "vertical") {
    guide.style.left = `${position}px`; // 直接使用页面全局坐标
  }
}

// 更新刻度线位置的辅助函数
function updateGuidePosition(guide, position, direction) {
  if (direction === "horizontal") {
    guide.style.top = `${position}px`;
  } else if (direction === "vertical") {
    guide.style.left = `${position}px`;
  }
}

// 调整标尺大小
function adjustRulerSize() {
  const rulerHorizontal = document.getElementById("ruler-horizontal");
  const rulerVertical = document.getElementById("ruler-vertical");

  if (rulerHorizontal) {
    rulerHorizontal.style.width = `${document.documentElement.scrollWidth}px`; // 调整水平标尺宽度
  }

  if (rulerVertical) {
    rulerVertical.style.height = `${document.documentElement.scrollHeight}px`; // 调整垂直标尺高度
  }
}
toggleGrid();
// 监听双击 Z 键，显示或隐藏删格
document.addEventListener("keydown", (e) => {
  if (e.key === "Z" && e.detail === 2) {
    // 双击 Z
    toggleGrid();
  }
});

// 监听双击 ZZ 键，清除所有刻度线和删格
document.addEventListener("keydown", (e) => {
  if (e.key === "Z" && e.detail === 4) {
    // 双击 ZZ
    removeGrid();
    isGridActive = false;
  }
});

// 监听窗口大小变化
window.addEventListener("resize", () => {
  adjustRulerSize();
});
