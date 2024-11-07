const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");
const axios = require("axios"); // 用于天气 API 请求

// 仅在开发环境中启用热更新
if (!app.isPackaged) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
    awaitWriteFinish: true,
  });
}

const LOGIN_URL = "https://auth.example.com/login.do";
const LOGOUT_URL = "https://auth.example.com/logout.do";
const CHECK_LOGIN_URL = "https://news.example.com/list";

let mainWindow;
let loginInterval;

/**
 * 获取 config.json 文件路径
 * @returns
 */
function getConfigPath() {
  const isDev = !app.isPackaged;
  const configPath = isDev
    ? path.join(__dirname, "config.json")
    : path.join(process.cwd(), "config.json");

  // 如果在生产环境中没有找到 config.json，可以复制一个默认的配置
  if (!isDev && !fs.existsSync(configPath)) {
    const defaultConfigPath = path.join(__dirname, "config.json");
    fs.copyFileSync(defaultConfigPath, configPath);
  }

  return configPath;
}

// 保存配置文件
function saveConfig(newConfig) {
  const configPath = getConfigPath();
  const currentConfig = readConfig();
  const updatedConfig = { ...currentConfig, ...newConfig };
  fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 4));
}

// 登录函数
async function login(username, password) {
  try {
    const response = await axios.post(LOGIN_URL, { username, password });
    const cookies = response.headers["set-cookie"];
    if (cookies) {
      saveConfig({ login: { cookies, username, password, rememberMe: true } });
      updateCookies(cookies);
      mainWindow.webContents.send("login-status", `已登录 (${username})`);
      startLoginCheckInterval();
      return true;
    }
  } catch (error) {
    console.error("登录失败", error);
  }
  return false;
}

// 更新应用的 Cookie 信息
function updateCookies(cookies) {
  session.defaultSession.clearStorageData({ storages: ["cookies"] });
  cookies.forEach((cookieString) => {
    const cookie = parseCookie(cookieString);
    session.defaultSession.cookies.set(cookie);
  });
}

// 解析 Cookie 字符串
function parseCookie(cookieString) {
  const [nameValue, ...attributes] = cookieString.split("; ");
  const [name, value] = nameValue.split("=");
  const cookie = { name, value, url: "https://example.com" }; // 设置URL域
  attributes.forEach((attr) => {
    const [key, val] = attr.split("=");
    cookie[key.toLowerCase()] = val || true;
  });
  return cookie;
}

// 自动登录检查
async function autoLogin() {
  const config = readConfig();
  if (config.login && config.login.rememberMe && config.login.cookies) {
    const isLoggedIn = await checkLoginStatus();
    if (!isLoggedIn) {
      await login(config.login.username, config.login.password);
    } else {
      updateCookies(config.login.cookies);
      startLoginCheckInterval();
    }
  }
}

// 检查登录状态
async function checkLoginStatus() {
  try {
    const response = await axios.get(CHECK_LOGIN_URL, {
      withCredentials: true,
    });
    const isLoggedIn =
      response.status === 200 && response.data.code === "success";
    return isLoggedIn;
  } catch {
    return false;
  }
}

// 启动定时检查登录状态
function startLoginCheckInterval() {
  clearInterval(loginInterval);
  loginInterval = setInterval(async () => {
    const isLoggedIn = await checkLoginStatus();
    if (!isLoggedIn) {
      const config = readConfig();
      await login(config.login.username, config.login.password);
    }
  }, 600000); // 每10分钟检查一次
}

// 注销功能
async function logout() {
  try {
    await axios.post(LOGOUT_URL, {}, { withCredentials: true });
    saveConfig({ login: { cookies: null, rememberMe: false } });
    clearInterval(loginInterval);
    session.defaultSession.clearStorageData({ storages: ["cookies"] });
    mainWindow.webContents.send("login-status", "未登录");
  } catch (error) {
    console.error("注销失败", error);
  }
}

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });
  mainWindow.loadFile("index.html");

  mainWindow.webContents.on("did-finish-load", () => {
    autoLogin();
  });

  // 确保关闭窗口时退出应用
  mainWindow.on("closed", () => {
    app.quit();
  });
}

// IPC 事件处理
ipcMain.handle("login", async (_, { username, password }) =>
  login(username, password)
);
ipcMain.on("logout", () => logout());
ipcMain.on("open-login", () => {
  const loginWin = new BrowserWindow({
    width: 400,
    height: 400,
    parent: mainWindow,
    modal: true,
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  loginWin.loadFile("login.html");
});

// 读取配置，初始化配置文件
function readConfig() {
  let config = {};
  const configPath = getConfigPath();
  try {
    config = JSON.parse(fs.readFileSync(configPath));
  } catch (error) {
    config = {
      environment: "testing",
      exportPath: path.join(__dirname, "output"),
      test: {},
      production: {},
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
  }
  return config;
}

// 打开设置窗口
function openSettingsWindow() {
  const settingsWin = new BrowserWindow({
    width: 500,
    height: 700,
    parent: BrowserWindow.getFocusedWindow(),
    modal: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  settingsWin.loadFile("settings.html");

  settingsWin.on("closed", () => {
    settingsWin.destroy();
  });
}

// JSON 转 Excel
ipcMain.handle("convert-json-to-excel", async (_, jsonContent) => {
  const config = readConfig();
  const outputDir = config.exportPath || path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sheet1");
  sheet.columns = Object.keys(jsonContent[0]).map((key) => ({
    header: key,
    key,
  }));
  jsonContent.forEach((row) => sheet.addRow(row));

  const outputPath = path.join(outputDir, "output.xlsx");
  await workbook.xlsx.writeFile(outputPath);
  return outputPath;
});

// Excel 解析
ipcMain.handle("parse-excel", async (_, filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  return sheet.columns.map((col) => col.header);
});

// 获取天气信息
ipcMain.handle("get-weather", async (_, city) => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${city}`
    );
    return `${response.data.location.name}：${response.data.current.temp_c}°C, ${response.data.current.condition.text}`;
  } catch (error) {
    return "无法获取天气数据";
  }
});

// 监听获取与保存配置事件
ipcMain.handle("get-config", () => readConfig());
ipcMain.handle("save-config", (_, newConfig) => saveConfig(newConfig));

// 选择文件路径对话框
ipcMain.handle("select-directory", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  return result.filePaths[0];
});

ipcMain.on("open-settings", openSettingsWindow);

// app.whenReady().then(createWindow);
app.on("ready", () => {
  createWindow();
  console.log("Config:", readConfig());
});

app.on("window-all-closed", () => {
  // 对于 macOS，通常需要在应用关闭时保留进程，但可以设置为直接退出
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
