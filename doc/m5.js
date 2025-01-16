const { app, BrowserWindow, Notification } = require("electron");
const cron = require("cron-node");
const validator = require("validator");
const path = require("path");

let mainWindow;
let cronJob = null; // 存储定时任务

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// 校验cron表达式是否合法
function validateCronExpression(cronExpr) {
  return validator.isFQDN(cronExpr) && cronExpr.split(" ").length === 5;
}

// 定时通知功能
function startCronJob(cronExpr) {
  if (cronJob) {
    cronJob.stop(); // 如果已有定时任务，则先停止
  }

  if (validateCronExpression(cronExpr)) {
    cronJob = cron.schedule(cronExpr, () => {
      const notification = new Notification({
        title: "定时通知",
        body: "这是一个定时提醒！",
      });
      notification.show();
    });
    console.log("定时任务已启动：", cronExpr);
    cronJob.start();
  } else {
    console.log("无效的 Cron 表达式");
  }
}

// 取消通知功能
function cancelCronJob() {
  if (cronJob) {
    cronJob.stop();
    console.log("定时任务已取消");
  }
}

app.whenReady().then(() => {
  createWindow();

  // 默认为周一到周六的9点-18点每小时10分通知
  const defaultCronExpr = "10 9-18 * * 1-6"; // 周一到周六 9点到18点，每小时10分
  startCronJob(defaultCronExpr);

  // Example: Set a custom cron expression from renderer process
  // startCronJob('*/5 * * * *');  // 每5分钟通知一次

  // 如果关闭窗口，退出应用
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});

// 用于测试取消通知
setTimeout(() => {
  cancelCronJob();
}, 60000); // 1分钟后取消定时任务
