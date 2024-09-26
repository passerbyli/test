const requestInterval = config.requestInterval;
// 定时发送请求，分别请求两个环境的接口
setInterval(function () {
  chrome.storage.local.get(["test_cookies", "prod_cookies"], function (data) {
    if (data.test_cookies) {
      fetchWithCookies(config.environments.test.apiUrl, data.test_cookies).then(
        (testData) => {
          console.log("测试环境数据:", testData);
        }
      );
    }

    if (data.prod_cookies) {
      fetchWithCookies(config.environments.prod.apiUrl, data.prod_cookies).then(
        (prodData) => {
          console.log("生产环境数据:", prodData);
        }
      );
    }
  });
}, requestInterval);

/**
 * 使用指定的 Cookies 向目标 URL 发起请求。
 * @param {string} url - 接口 URL。
 * @param {Array} cookies - Cookies。
 * @returns {Promise} - 返回请求的数据。
 */
function fetchWithCookies(url, cookies) {
  return fetch(url, {
    credentials: "include",
    headers: {
      Cookie: cookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; "),
    },
  }).then((response) => response.json());
}

/* START */
// 创建圆形浮窗按钮
const floatingButton = document.createElement("div");
floatingButton.id = "floating-button";
floatingButton.innerText = "🌀"; // 使用 Emoji 作为按钮
document.body.appendChild(floatingButton);

// 创建弹出菜单
const popupMenu = document.createElement("div");
popupMenu.id = "popup-menu";
popupMenu.innerHTML = `
  <h3>菜单选项</h3>
  <button id="compare-button">触发接口对比</button>
  <p>这里可以放置其他按钮及描述</p>
  <button id="other-button">其他功能</button>
`;
document.body.appendChild(popupMenu);

// 隐藏弹出菜单
popupMenu.style.display = "none";

// 控制浮窗的显示和隐藏
let isFloatingButtonVisible = false; // 默认浮窗为不可见

function toggleFloatingButton() {
  isFloatingButtonVisible = !isFloatingButtonVisible;
  floatingButton.style.display = isFloatingButtonVisible ? "block" : "none";
  popupMenu.style.display = "none"; // 隐藏弹出菜单
}

// 在页面加载时将浮窗隐藏
floatingButton.style.display = "none";

// 添加拖动功能
floatingButton.onmousedown = function (event) {
  event.preventDefault(); // 防止文本选择
  let shiftX = event.clientX - floatingButton.getBoundingClientRect().left;
  let shiftY = event.clientY - floatingButton.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    floatingButton.style.left = pageX - shiftX + "px";
    floatingButton.style.top = pageY - shiftY + "px";

    // 移动弹出菜单
    popupMenu.style.left =
      parseInt(floatingButton.style.left) +
      floatingButton.offsetWidth +
      10 +
      "px"; // 在按钮右侧显示菜单
    popupMenu.style.top = floatingButton.style.top; // 菜单和按钮垂直对齐
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener("mousemove", onMouseMove);

  floatingButton.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    floatingButton.onmouseup = null;
  };
};

// 点击浮窗显示/隐藏弹出菜单
floatingButton.onclick = function () {
  if (popupMenu.style.display === "none") {
    popupMenu.style.display = "block";
  } else {
    popupMenu.style.display = "none";
  }
};

// 点击按钮触发接口对比的功能
document.getElementById("compare-button").onclick = function () {
  console.log("接口对比功能触发");
  // 在这里实现接口对比的具体逻辑
};

// 点击其他按钮的逻辑
document.getElementById("other-button").onclick = function () {
  console.log("其他功能按钮被点击");
};

// 关闭弹出菜单
document.addEventListener("click", function (event) {
  if (
    !floatingButton.contains(event.target) &&
    !popupMenu.contains(event.target)
  ) {
    popupMenu.style.display = "none";
  }
});

// 监听来自背景脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleFloatingButton") {
    toggleFloatingButton();
    // 只有在切换浮窗状态时，才要设置浮窗的显示状态
    floatingButton.style.display = isFloatingButtonVisible ? "block" : "none";
  }
});

/* END */
