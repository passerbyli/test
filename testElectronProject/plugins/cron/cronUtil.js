const { CronJob: NodeCronJob } = require("cron");
const validator = require("validator");

class CronJob {
  constructor(name = "DefaultJob") {
    this.name = name;
    this.cronExpr = "0 * * * * *"; // 默认每分钟执行一次
    this._job = null;
    this._callback = () => {
      console.log(`[${this.name}] 默认任务执行`);
    };
  }

  setCallback(fn) {
    if (typeof fn === "function") {
      this._callback = fn;
    } else {
      throw new Error("Callback 必须是函数");
    }
  }

  setExpression(expr) {
    if (typeof expr === "string" && validator.isLength(expr, { min: 9 })) {
      this.cronExpr = expr;
    } else {
      throw new Error("无效的 cron 表达式");
    }
  }

  start() {
    if (this._job) {
      this._job.stop();
    }

    try {
      this._job = new NodeCronJob(
        this.cronExpr,
        this._callback,
        null,
        true // 立即启动
      );
      console.log(`[${this.name}] 启动定时任务：${this.cronExpr}`);
    } catch (error) {
      console.error(`[${this.name}] 启动失败：`, error.message);
    }
  }

  stop() {
    if (this._job) {
      this._job.stop();
      this._job = null;
      console.log(`[${this.name}] 定时任务已停止`);
    }
  }
}

module.exports = {
  CronJob,
};

if (require.main === module) {
  const job = new CronJob("MyJob");
  job.setExpression("*/5 * * * * *"); // 每5秒执行
  job.setCallback(() => {
    console.log("定时任务触发", new Date().toLocaleTimeString());
  });
  job.start();

  // 例如 10 秒后手动停止
  setTimeout(() => {
    job.stop();
  }, 10000);
}
