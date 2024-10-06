window.onload = function () {
  // 创建导航条的容器
  const navBar = document.createElement("div");
  navBar.id = "jd-plugin-nav";
  navBar.style.position = "fixed";
  navBar.style.bottom = "0"; // 紧贴视窗底部
  navBar.style.left = "0"; // 左对齐
  navBar.style.width = "200px"; // 固定宽度，默认展开时的宽度
  navBar.style.height = "40px"; // 高度不超过40px
  navBar.style.background = "#f8f8f8";
  navBar.style.borderTop = "1px solid #ddd";
  navBar.style.padding = "0 10px";
  navBar.style.display = "flex";
  navBar.style.alignItems = "center";
  navBar.style.justifyContent = "space-between"; // 按钮和箭头之间有间距
  navBar.style.transition = "left 0.3s"; // 添加过渡动画
  navBar.innerHTML = `
    <div id="nav-buttons" style="display: flex; flex-grow: 1; justify-content: space-evenly;">
      <button class="nav-btn">按钮1</button>
      <button class="nav-btn">按钮2</button>
      <button class="nav-btn">按钮3</button>
      <button class="nav-btn">按钮4</button>
      <button class="nav-btn">按钮5</button>
    </div>
    <div id="toggle-arrow" style="text-align: right;">
      <span id="arrow" style="cursor: pointer;">⬅</span>
    </div>
  `;

  document.body.appendChild(navBar);

  // 初始化导航条为收起状态
  let isCollapsed = true;
  navBar.style.left = "-160px"; // 只显示箭头部分

  // 收缩与展开功能
  document.getElementById("arrow").addEventListener("click", () => {
    if (isCollapsed) {
      navBar.style.left = "0"; // 展开
      document.getElementById("arrow").innerText = "⬅";
    } else {
      navBar.style.left = "-160px"; // 收起，只显示箭头
      document.getElementById("arrow").innerText = "➡";
    }
    isCollapsed = !isCollapsed;
  });

  // 按钮点击事件
  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      showPopup(`按钮 ${index + 1} 的文本`);
    });
  });

  // 显示浮窗
  function showPopup(text) {
    let popup = document.createElement("div");
    popup.id = "popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.padding = "20px";
    popup.style.background = "#fff";
    popup.style.border = "1px solid #ddd";
    popup.style.zIndex = "1000"; // 确保浮窗显示在前面
    popup.innerHTML = `<span>${text}</span> <span style="cursor: pointer;" id="close-popup">[X]</span>`;

    document.body.appendChild(popup);

    // 关闭浮窗
    document.getElementById("close-popup").addEventListener("click", () => {
      popup.remove();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        popup.remove();
      }
    });
  }
};
