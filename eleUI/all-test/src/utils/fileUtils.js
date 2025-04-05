// src/utils/fileUtils.js
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config.json");

// 读取配置文件
function readConfig() {
  try {
    const data = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {}; // 如果文件不存在或者读取失败，返回空对象
  }
}

// 写入配置文件
function writeConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing config file:", error);
  }
}

module.exports = { readConfig, writeConfig };
