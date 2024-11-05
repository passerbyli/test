const { ipcRenderer } = require("electron");

// 加载配置
async function loadConfig() {
  const config = await ipcRenderer.invoke("get-config");
  document.getElementById("export-path").value = config.exportPath;
  document.getElementById("env").value = config.env;
  document.getElementById("test-db").value = config.connections.test.db;
  document.getElementById("test-user").value = config.connections.test.user;
  document.getElementById("test-password").value =
    config.connections.test.password;
  document.getElementById("prod-db").value = config.connections.production.db;
  document.getElementById("prod-user").value =
    config.connections.production.user;
  document.getElementById("prod-password").value =
    config.connections.production.password;
}

// 选择导出路径
document
  .getElementById("select-directory")
  .addEventListener("click", async () => {
    const result = await ipcRenderer.invoke("select-directory");
    if (result.filePaths && result.filePaths[0]) {
      document.getElementById("export-path").value = result.filePaths[0];
    }
  });

// 保存配置
document.getElementById("save-config").addEventListener("click", async () => {
  const newConfig = {
    exportPath: document.getElementById("export-path").value,
    env: document.getElementById("env").value,
    connections: {
      test: {
        db: document.getElementById("test-db").value,
        user: document.getElementById("test-user").value,
        password: document.getElementById("test-password").value,
      },
      production: {
        db: document.getElementById("prod-db").value,
        user: document.getElementById("prod-user").value,
        password: document.getElementById("prod-password").value,
      },
    },
  };

  await ipcRenderer.invoke("update-config", newConfig);
  alert("配置已更新");
  window.close(); // 关闭设置窗口
});

// 页面加载时加载配置
loadConfig();
