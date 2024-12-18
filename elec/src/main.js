const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  Notification,
} = require("electron");
const path = require("path");
const fs = require("fs");
const { setInterval } = require("timers");

// 配置文件和待办事项存储路径
const configPath = path.join(__dirname, "config.json");
const listPath = path.join(__dirname, "list.json");

// 读取配置文件
function loadConfig() {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath));
  }
  return { closeOnExit: true, notificationsEnabled: true };
}

// 读取待办事项
function loadTodos() {
  if (fs.existsSync(listPath)) {
    return JSON.parse(fs.readFileSync(listPath));
  }
  return [];
}

// 保存待办事项
function saveTodos(todos) {
  fs.writeFileSync(listPath, JSON.stringify(todos, null, 2));
}

// 创建主窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 预加载文件
      contextIsolation: true, // 启用上下文隔离
      nodeIntegration: false, // 禁用 Node.js 集成
    },
  });
  win.loadFile(path.join(__dirname, "index.html"));

  win.on("closed", () => {
    app.quit();
  });

  // 向渲染进程发送版本号、名称及通知启用状态
  win.webContents.on("did-finish-load", () => {
    win.webContents.send("app-info", {
      appName,
      appVersion,
      notificationsEnabled: settings.notificationsEnabled,
    });
  });

  return win;
}

// 定时提醒
function scheduleNotification(todo) {
  const now = new Date();
  const startTime = new Date(todo.start);
  const timeDifference = startTime - now;

  if (timeDifference > 0) {
    setTimeout(() => {
      if (loadConfig().notificationsEnabled) {
        new Notification({
          title: todo.title,
          body: todo.content,
        }).show();
      }
    }, timeDifference);
  }
}

// 打开设置窗口
ipcMain.on("open-settings", () => {
  const settingsWin = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false, // 禁用调整窗口大小
    maximizable: false, // 禁用最大化
    minimizable: false, // 禁用最小化
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 预加载文件
      contextIsolation: true, // 启用上下文隔离
      nodeIntegration: false, // 禁用 Node.js 集成
    },
  });
  settingsWin.loadFile(path.join(__dirname, "settings.html"));
});

// 监听设置更新
ipcMain.on("update-config", (event, newConfig) => {
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
  event.reply("config-updated", newConfig);
});

// 监听添加待办事项
ipcMain.on("add-todo", (event, newTodo) => {
  new Notification({
    title: "xxx",
    body: "das",
  }).show();
  console.log("222");

  const todos = loadTodos();
  todos.push(newTodo);
  saveTodos(todos);
  scheduleNotification(newTodo); // 设置通知
  event.reply("todos-updated", todos);
});

// 监听更新待办事项
ipcMain.on("update-todo", (event, updatedTodo) => {
  const todos = loadTodos();
  const index = todos.findIndex((todo) => todo.id === updatedTodo.id);
  if (index !== -1) {
    todos[index] = updatedTodo;
    saveTodos(todos);
    event.reply("todos-updated", todos);
  }
});

// 加载待办事项并发送到渲染进程
ipcMain.on("load-todos", (event) => {
  const todos = loadTodos();
  event.reply("todos-updated", todos);
});

// 创建托盘图标
app.whenReady().then(() => {
  const win = createWindow();
  const todos = loadTodos();

  // 加载待办事项并发送到渲染进程
  win.webContents.on("did-finish-load", () => {
    win.webContents.send("todos-updated", todos);
  });

  // 创建托盘图标
  const tray = new Tray(path.join(__dirname, "resources", "app-icon.png"));
  const contextMenu = Menu.buildFromTemplate([{ label: "Quit", role: "quit" }]);
  tray.setToolTip("Todolist App");
  tray.setContextMenu(contextMenu);
});

// 确保应用退出
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
