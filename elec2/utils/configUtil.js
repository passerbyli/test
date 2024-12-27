const fs = require("fs");
const path = require("path");

// 判断当前是否处于打包状态
const isPackaged = process.env.NODE_ENV === "production" || app.isPackaged;

// 获取运行时目录（开发时使用 __dirname，打包后使用 app.getPath('exe') 的父目录）
const runtimePath = isPackaged
  ? path.dirname(process.execPath) // 打包后路径
  : __dirname; // 开发路径

const configPath = path.join(runtimePath, "config.json");

// 默认配置
const defaultConfig = {
  environment: "test",
  database: {
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
  },
  exportPath: "./exports",
};

// 读取配置
function getConfig() {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

// 写入配置
function saveConfig(newConfig) {
  const config = { ...getConfig(), ...newConfig }; // 合并新配置
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return config;
}

module.exports = {
  getConfig,
  saveConfig,
  configPath,
};
