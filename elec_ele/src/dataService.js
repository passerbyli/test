const XLSXPopulate = require("xlsx-populate");
const path = require("path");
const fs = require("fs");

async function fetchData() {
  // 模拟数据，通常会根据你的实际需求来定义数据结构
  return [
    { column1: "数据1", column2: "数据2", column3: "数据3", column4: "数据4" },
    { column1: "数据5", column2: "数据6", column3: "数据7", column4: "数据8" },
    {
      column1: "数据9",
      column2: "数据10",
      column3: "数据11",
      column4: "数据12",
    },
  ];
}

async function exportExcel() {
  try {
    // 读取模板文件
    const templatePath = path.join(__dirname, "templates/template.xlsx");
    const workbook = await XLSXPopulate.fromFileAsync(templatePath);

    // 获取模拟数据
    const data = await fetchData();

    // 填充第一个sheet页的表格数据
    const sheet1 = workbook.sheet(0);
    const startRow = 2; // 数据从第2行开始填充
    data.forEach((item, index) => {
      const row = sheet1.row(startRow + index); // 每行数据填充
      row.cell(1).value(item.column1);
      row.cell(2).value(item.column2);
      row.cell(3).value(item.column3);
      row.cell(4).value(item.column4);
    });

    // 第二个Sheet页添加图片
    // const sheet2 = workbook.sheet(1);
    // const imagePath = path.join(__dirname, "assets/image.png");
    // const imageData = fs.readFileSync(imagePath);
    // sheet2.image(imageData).resize(300, 200).move(2, 2); // 设置图片的大小和位置

    // 保存文件
    const outputFilePath = path.join(__dirname, "output.xlsx");
    await workbook.toFileAsync(outputFilePath);

    console.log("Excel 导出成功，文件保存在:", outputFilePath);
    return outputFilePath;
  } catch (error) {
    console.error("导出失败:", error);
    throw error;
  }
}

module.exports = {
  exportExcel,
};
