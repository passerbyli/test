const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  Tray,
  Menu,
  nativeImage,
} = require("electron");
const path = require("path");
const fs = require("fs");
const moment = require("moment"); // 用于处理时间格式
const cron = require("node-cron");
const notifier = require("node-notifier");

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "renderer.js"),
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createTray() {
  const trayIcon = nativeImage.createFromPath(
    path.join(__dirname, "assets", "tray-icon.png")
  );
  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: "打开", click: () => mainWindow.show() },
    { label: "退出", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
}

let todoList = []; // 保存代办事项列表
let notificationTimers = {}; // 存储特定时间提醒任务的定时器
let cronJobs = {}; // 存储周期性定时任务

// 加载代办事项数据
function loadTodoList() {
  if (fs.existsSync("todos.json")) {
    const data = fs.readFileSync("todos.json");
    todoList = JSON.parse(data);
  }
}

// 保存代办事项数据
function saveTodoList() {
  fs.writeFileSync("todos.json", JSON.stringify(todoList, null, 2));
}

// 处理定时任务（周期性任务）
function scheduleCronJob(task) {
  const cronJob = cron.schedule(task.cronTime, () => {
    new Notification({ title: task.title, body: task.description }).show();
    notifier.notify({
      title: "提醒",
      message: `${task.title}: ${task.description}`,
    });
  });

  cronJobs[task.id] = cronJob;
}

// 处理特定时间的提醒任务
function scheduleNotification(task) {
  const reminderTime = moment(task.reminderTime, "YYYY-MM-DD HH:mm:ss"); // 将提醒时间转为 moment 对象
  const now = moment();

  if (reminderTime.isBefore(now)) {
    // 如果设置的提醒时间已经过去，立即发送通知
    new Notification({ title: task.title, body: task.description }).show();
    notifier.notify({
      title: "提醒",
      message: `${task.title}: ${task.description}`,
    });
  } else {
    // 计算到提醒时间的剩余时间
    const timeDifference = reminderTime.diff(now);

    // 使用 setTimeout 在到达指定时间时发送通知
    const timer = setTimeout(() => {
      new Notification({ title: task.title, body: task.description }).show();
      notifier.notify({
        title: "提醒",
        message: `${task.title}: ${task.description}`,
      });
    }, timeDifference);

    // 保存定时器，以便可以取消
    notificationTimers[task.id] = timer;
  }
}

// 取消特定时间的提醒任务
function cancelNotification(taskId) {
  if (notificationTimers[taskId]) {
    clearTimeout(notificationTimers[taskId]);
    delete notificationTimers[taskId];
  }
}

// 取消定时任务
function cancelCronJob(taskId) {
  if (cronJobs[taskId]) {
    cronJobs[taskId].stop();
    delete cronJobs[taskId];
  }
}

// 更新任务
function updateTask(taskId, updatedTask) {
  const index = todoList.findIndex((task) => task.id === taskId);
  if (index !== -1) {
    todoList[index] = updatedTask;
    saveTodoList();
    if (updatedTask.cronTime) {
      cancelCronJob(taskId); // 取消旧的定时任务
      scheduleCronJob(updatedTask); // 安排新的周期性任务
    } else {
      cancelNotification(taskId); // 取消旧的提醒任务
      scheduleNotification(updatedTask); // 安排新的提醒任务
    }
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  // 加载代办事项
  loadTodoList();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  ipcMain.handle("getTodoList", () => {
    return todoList;
  });

  ipcMain.handle("addTodo", (_, task) => {
    todoList.push(task);
    saveTodoList();
    if (task.cronTime) {
      scheduleCronJob(task); // 安排周期性定时任务
    } else {
      scheduleNotification(task); // 安排指定时间的提醒任务
    }
  });

  ipcMain.handle("cancelTask", (_, taskId) => {
    const taskIndex = todoList.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      todoList.splice(taskIndex, 1); // 删除任务
      saveTodoList();
      if (todoList[taskIndex].cronTime) {
        cancelCronJob(taskId); // 取消定时任务
      } else {
        cancelNotification(taskId); // 取消提醒任务
      }
    }
  });

  ipcMain.handle("updateTask", (_, taskId, updatedTask) => {
    updatedTask.id = taskId;
    updateTask(taskId, updatedTask); // 更新任务
  });
});
