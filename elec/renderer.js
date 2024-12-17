const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  // 加载配置
  ipcRenderer.invoke("loadConfig").then((config) => {
    // 初始化UI
    document.getElementById("version").textContent = "v1.0.0";
    document.getElementById("loginStatus").textContent = config.appAccount
      .username
      ? "已登录"
      : "未登录";
    document
      .getElementById("loginButton")
      .addEventListener("click", showLoginDialog);
    document.getElementById("logoutButton").addEventListener("click", logout);
    document
      .getElementById("settingsButton")
      .addEventListener("click", showSettingsDialog);
  });
});

// 登录弹窗
function showLoginDialog() {
  const loginWindow = new BrowserWindow({
    width: 400,
    height: 300,
    modal: true,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  loginWindow.loadURL("login.html");
}

// 注销功能
function logout() {
  ipcRenderer.invoke("loadConfig").then((config) => {
    config.appAccount.cookies = "";
    config.appAccount.username = "";
    config.appAccount.password = "";
    ipcRenderer.invoke("saveConfig", config);
    document.getElementById("loginStatus").textContent = "未登录";
  });
}

// 登录弹窗
function showLoginDialog() {
  const loginWindow = new BrowserWindow({
    width: 400,
    height: 300,
    modal: true,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  loginWindow.loadURL("login.html");

  // 模拟登录成功
  ipcRenderer.on("login-success", () => {
    loginWindow.close(); // 关闭登录窗口
    document.getElementById("loginStatus").textContent = "已登录";
  });
}
