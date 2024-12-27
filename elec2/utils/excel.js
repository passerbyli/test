const logger = require("../logger");

// 打印日志
logger.info("应用启动");
logger.warn("注意：某些配置可能不正确");
logger.error("错误：无法连接到服务器");

module.exports = function () {
  console.log("xxx");
};
