document.getElementById("export-btn").addEventListener("click", async () => {
  const result = await window.api.selectJson();
  if (result) {
    alert(`Excel 文件已导出到: ${result}`);
  } else {
    alert("操作已取消或发生错误");
  }
});

// 设置页面操作
document.addEventListener("DOMContentLoaded", async () => {
  const exportPathInput = document.getElementById("export-path");
  const dbHostInput = document.getElementById("db-host");
  const dbUserInput = document.getElementById("db-user");
  const dbPasswordInput = document.getElementById("db-password");
  const saveButton = document.getElementById("save-settings");

  // 读取当前设置
  const settings = await window.api.getSettings();
  if (settings) {
    exportPathInput.value = settings.exportPath || "";
    dbHostInput.value = settings.database.host || "";
    dbUserInput.value = settings.database.username || "";
    dbPasswordInput.value = settings.database.password || "";
  }

  // 保存设置
  saveButton.addEventListener("click", async () => {
    const newSettings = {
      exportPath: exportPathInput.value,
      database: {
        host: dbHostInput.value,
        username: dbUserInput.value,
        password: dbPasswordInput.value,
      },
    };
    const result = await window.api.saveSettings(newSettings);
    alert(result ? "设置已保存" : "保存设置时出错");
  });
});
