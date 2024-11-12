const fs = require("fs");
const path = require("path");

// 日志文件路径
const logFile = path.join(__dirname, "app.log");

// 日志打印函数
function log(level, message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

  // 写入日志文件
  fs.appendFileSync(logFile, logEntry);

  // 打印到控制台
  if (level === "error") {
    console.error(logEntry.trim());
  } else if (level === "warn") {
    console.warn(logEntry.trim());
  } else {
    console.log(logEntry.trim());
  }
}

// 导出日志接口
module.exports = {
  info: (msg) => log("info", msg),
  warn: (msg) => log("warn", msg),
  error: (msg) => log("error", msg),
};
