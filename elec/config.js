// config.js
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config.json");

// 读取整个配置
function getConfig() {
  const data = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(data);
}

// 更新整个配置
function setConfig(newConfig) {
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
}

// 更新单个字段
function updateConfigField(field, value) {
  const config = getConfig();
  config[field] = value;
  setConfig(config);
}

module.exports = { getConfig, setConfig, updateConfigField };
