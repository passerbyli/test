// excelGenerator.js
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { getConfig } = require("./config");

async function generateExcel(jsonData) {
  const config = getConfig();
  const exportDir = config.exportPath;

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const exportPath = path.join(exportDir, `export_${Date.now()}.xlsx`);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // 添加表头
  const headers = Object.keys(jsonData[0]);
  worksheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: 20,
  }));

  // 添加数据行
  jsonData.forEach((row) => worksheet.addRow(row));

  // 保存 Excel 文件
  await workbook.xlsx.writeFile(exportPath);
  return exportPath;
}

module.exports = { generateExcel };
