// content.js
let isSelectionMode = false; // 选择模式开关
let highlightedElement = null; // 高亮显示的元素
let floatWindow = null; // 浮窗元素
let zPressed = false; // Z 键是否被按下
let xPressed = false; // X 键是否被按下
let highlightTimeout = null; // 高亮显示的延迟定时器

// 监听键盘按下事件
document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "z") zPressed = true;
  if (event.key.toLowerCase() === "x") xPressed = true;

  // Z 和 X 键同时按下，激活选择模式
  if (zPressed && xPressed && !isSelectionMode) {
    isSelectionMode = true;
    console.log("选择模式激活");
  } else if (zPressed && xPressed && isSelectionMode) {
    isSelectionMode = false;
    console.log("选择模式停用");
    removeHighlight();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key.toLowerCase() === "z") zPressed = false;
  if (event.key.toLowerCase() === "x") xPressed = false;
});

// 监听鼠标移动事件
document.addEventListener("mousemove", (event) => {
  if (!isSelectionMode) return;

  clearTimeout(highlightTimeout);

  const target = event.target.closest("[data-sku]");

  // 鼠标停顿 200 毫秒后高亮显示目标元素
  highlightTimeout = setTimeout(() => {
    if (highlightedElement) {
      highlightedElement.style.outline = "";
    }

    if (target) {
      highlightedElement = target;
      highlightedElement.style.outline = "3px solid red";
      console.log("元素已高亮:", target);
    }
  }, 200);
});

// 监听点击事件
document.addEventListener("click", (event) => {
  if (!isSelectionMode) return;

  event.stopPropagation();
  event.preventDefault();

  // 确保当前点击元素的父层元素包含 data-sku 属性
  const skuElement = event.target.closest("[data-sku]");
  if (skuElement) {
    const sku = skuElement.getAttribute("data-sku");
    chrome.storage.local.set({ sku }, () => {
      console.log("SKU 已存储:", sku);

      // 获取最新的请求数据并创建浮窗
      chrome.storage.local.get(["latestRequestData"], (result) => {
        const { url, method, params, body } = result.latestRequestData || {};
        if (url && method && params) {
          createFloatingWindow(sku, url, method, params, body);
          sendApiRequest(url, params, body);
        } else {
          console.log("未找到匹配的请求数据，SKU:", sku);
        }
      });
    });
  }
});

// 创建浮窗并显示请求数据
function createFloatingWindow(sku, url, method, params, body) {
  closeFloatingWindow();

  floatWindow = document.createElement("div");
  floatWindow.id = "sku-float-window";
  floatWindow.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; padding: 10px; background-color: white;
    border-bottom: 1px solid #ccc; z-index: 9999;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  `;

  floatWindow.innerHTML = `
    <div>
      <strong>SKU:</strong> <span>${sku}</span> <br />
      <strong>Method:</strong> <span>${method}</span> <br />
      <strong>URL:</strong> <span>${url}</span> <br />
      <strong>Query Params:</strong> <pre>${
        JSON.stringify(params, null, 2) || "{}"
      }</pre>
      <strong>Body Params:</strong> <pre>${
        JSON.stringify(body, null, 2) || "{}"
      }</pre>
      <button id="copy-data">复制</button>
      <button id="close-float-window">关闭</button>
      <div id="api-response"></div>
    </div>
  `;

  document.body.appendChild(floatWindow);
  console.log("浮窗已创建并显示");

  // 绑定按钮点击事件
  document
    .getElementById("copy-data")
    .addEventListener("click", copyDataToClipboard);
  document
    .getElementById("close-float-window")
    .addEventListener("click", closeFloatingWindow);
}

// 复制浮窗内的数据到剪贴板
function copyDataToClipboard() {
  const data = floatWindow.innerText;
  navigator.clipboard.writeText(data).then(() => {
    alert("数据已复制到剪贴板!");
  });
}

// 关闭浮窗
function closeFloatingWindow() {
  if (floatWindow) {
    document.body.removeChild(floatWindow);
    floatWindow = null;
    console.log("浮窗已关闭");
  }
}

// 发送 API 请求并在浮窗中显示结果
function sendApiRequest(url, params, body) {
  console.log("发送 API 请求...");
  fetch("https://api.m.jd.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, params, body }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(
        "api-response"
      ).innerText = `API Response: ${JSON.stringify(data)}`;
      console.log("API 响应:", data);
    })
    .catch((error) => {
      document.getElementById(
        "api-response"
      ).innerText = `API 请求失败: ${error}`;
      console.log("API 请求失败:", error);
    });
}

// 监听 ESC 键关闭浮窗
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFloatingWindow();
  }
});
