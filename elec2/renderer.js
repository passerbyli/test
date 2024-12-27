document.addEventListener("DOMContentLoaded", () => {
  // 日志容器
  const logContainer = document.getElementById("logContainer");

  // 重写 console 方法，用于显示渲染进程日志
  // ["log", "info", "warn", "error", "debug"].forEach((method) => {
  //   const originalMethod = console[method];
  //   console[method] = function (...args) {
  //     const logItem = document.createElement("div");
  //     logItem.className = `log-${method}`;
  //     logItem.textContent = `[RENDERER ${method.toUpperCase()}] ${args.join(
  //       " "
  //     )}`;
  //     logContainer.appendChild(logItem);
  //     logContainer.scrollTop = logContainer.scrollHeight; // 自动滚动到底部
  //     originalMethod.apply(console, args);
  //   };
  // });

  // 接收并显示主进程日志
  electronAPI.onMainLog((log) => {
    // const logItem = document.createElement("div");
    // logItem.className = `log-${log.level}`;
    // logItem.textContent = `[MAIN ${log.level.toUpperCase()}] ${log.message}`;
    // logContainer.appendChild(logItem);
    // logContainer.scrollTop = logContainer.scrollHeight; // 自动滚动到底部
  });

  // 显示登录状态
  window.electronAPI.onLoginStatusChange((status) => {
    document.getElementById("login-status").innerText = status;
    document.getElementById("login-btn").innerText = status.includes("已登录")
      ? "注销"
      : "登录";
  });

  // 登录或注销按钮
  document.getElementById("login-btn").onclick = () => {
    const isLoggedIn = document
      .getElementById("login-status")
      .innerText.includes("已登录");
    if (isLoggedIn) {
      window.electronAPI.logout();
    } else {
      window.electronAPI.openLogin();
    }
  };

  // 监听登录状态变化
  window.electronAPI.onLoginStatusChange((status) => {
    document.getElementById("login-status").innerText = status;
  });

  // 读取配置并更新环境选择
  window.electronAPI.getConfig().then((config) => {
    document.getElementById("environment-toggle").value = config.environment;
  });

  // 打开设置窗口
  document.getElementById("settings-btn").addEventListener("click", () => {
    window.electronAPI.openSettings();
  });

  // 环境选择
  document
    .getElementById("environment-toggle")
    .addEventListener("change", (event) => {
      const newEnv = event.target.value;
      window.electronAPI.saveConfig({ environment: newEnv });
    });

  // JSON 转换功能
  document.getElementById("json-converter").addEventListener("click", () => {
    document.getElementById("content").innerHTML = `
            <h2>JSON 转换</h2>
            <input type="file" id="json-file" accept=".json">
            <button id="convert-btn">转换 JSON 到 Excel</button>
            <p id="status"></p>
        `;

    document
      .getElementById("convert-btn")
      .addEventListener("click", async () => {
        const fileInput = document.getElementById("json-file");
        if (fileInput.files.length === 0) {
          alert("请选择 JSON 文件");
          return;
        }
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
          const jsonContent = JSON.parse(event.target.result);
          const outputPath = await window.electronAPI.convertJsonToExcel(
            jsonContent
          );
          document.getElementById(
            "status"
          ).innerText = `转换成功！文件保存至: ${outputPath}`;
        };
        reader.readAsText(file);
      });
  });

  // Excel 解析功能
  document.getElementById("excel-parser").addEventListener("click", () => {
    document.getElementById("content").innerHTML = `
            <h2>Excel 解析</h2>
            <input type="file" id="excel-file" accept=".xlsx">
            <button id="parse-btn">解析 Excel 文件</button>
            <p id="result"></p>
        `;

    document.getElementById("parse-btn").addEventListener("click", async () => {
      const fileInput = document.getElementById("excel-file");
      if (fileInput.files.length === 0) {
        alert("请选择 Excel 文件");
        return;
      }
      const filePath = fileInput.files[0].path;
      const columns = await window.electronAPI.parseExcel(filePath);
      document.getElementById("result").innerText = `Excel 表头: ${columns.join(
        ", "
      )}`;
    });
  });

  // 天气查询功能
  document.getElementById("weather").addEventListener("click", () => {
    document.getElementById("content").innerHTML = `
            <h2>最新天气</h2>
            <input type="text" id="city" placeholder="输入城市名称">
            <button id="get-weather">查询天气</button>
            <p id="weather-result"></p>
        `;

    document
      .getElementById("get-weather")
      .addEventListener("click", async () => {
        const city = document.getElementById("city").value;
        if (!city) {
          alert("请输入城市名称");
          return;
        }
        const weather = await window.electronAPI.getWeather(city);
        document.getElementById(
          "weather-result"
        ).innerText = `当前天气：${weather}`;
      });
  });
});
