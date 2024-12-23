const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const XlsxPopulate = require("xlsx-populate"); // 引入 xlsx-populate
const fs = require("fs");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  // 这里处理 Excel 导出的功能
  ipcMain.handle("export-excel", async () => {
    return await exportDataFromTemplate();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 模拟数据
const mockData = [
  {
    serialNo: "001",
    title: "任务1",
    detail: "任务1的详细信息",
    startDate: "2023-01-01",
    endDate: "2023-01-31",
    status: "进行中",
  },
  {
    serialNo: "002",
    title: "任务2",
    detail: "任务2的详细信息",
    startDate: "2023-02-01",
    endDate: "2023-02-28",
    status: "已完成",
  },
  {
    serialNo: "003",
    title: "任务3",
    detail: "任务3的详细信息",
    startDate: "2023-03-01",
    endDate: "2023-03-31",
    status: "待定",
  },
];

// 导出数据并填充到模板
async function exportDataFromTemplate() {
  try {
    // 步骤 1: 读取模板文件（xlsx-populate 支持读取含图片的模板）
    const workbook = await XlsxPopulate.fromFileAsync(
      path.join(__dirname, "template.xlsx")
    ); // 模板文件路径

    // 获取 sheet1 和 sheet2
    const sheet1 = workbook.sheet(0); // 第一个sheet用于填充数据
    const sheet2 = workbook.sheet(1); // 第二个sheet假设含有图片

    // 步骤 2: 使用模拟数据填充第一个 sheet
    mockData.forEach((item, index) => {
      // 填充表头内容
      sheet1.cell(`A${index + 2}`).value(item.serialNo || ""); // 序号
      sheet1.cell(`B${index + 2}`).value(item.title || ""); // 标题
      sheet1.cell(`C${index + 2}`).value(item.detail || ""); // 详情
      sheet1.cell(`D${index + 2}`).value(item.startDate || ""); // 开始日期
      sheet1.cell(`E${index + 2}`).value(item.endDate || ""); // 结束日期
      sheet1.cell(`F${index + 2}`).value(item.status || ""); // 状态
    });

    // 步骤 3: 保持模板中的图片和注释不变，直接保留
    // 在 xlsx-populate 中，图片会被自动保留，注释也会被保留
    // 无需额外处理，只要在保存文件时不覆盖这些内容

    // 步骤 4: 导出新文件
    const outputFilePath = path.join(__dirname, "output.xlsx");
    await workbook.toFileAsync(outputFilePath);
    console.log("导出 Excel 文件成功！");
    return outputFilePath;
  } catch (error) {
    console.error("导出 Excel 时发生错误：", error);
    throw error;
  }
}
