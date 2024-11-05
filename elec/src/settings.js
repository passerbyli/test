const fs = require("fs");
const path = require("path");
const { app } = require("electron");

// 定义配置文件路径，使用 Electron 的用户数据路径，保证路径正确且在用户目录下
const settingsPath = path.join(app.getPath("userData"), "settings.json");

// 检查配置文件是否存在，不存在则创建一个空的默认配置文件
function ensureSettingsFileExists() {
  if (!fs.existsSync(settingsPath)) {
    const defaultSettings = {
      exportPath: "",
      database: {
        host: "",
        username: "",
        password: "",
      },
    };
    fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));
  }
}

// 读取配置
function getSettings() {
  try {
    ensureSettingsFileExists();
    const data = fs.readFileSync(settingsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading settings:", error);
    return null;
  }
}

// 保存配置
function saveSettings(newSettings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
}

module.exports = { getSettings, saveSettings };
