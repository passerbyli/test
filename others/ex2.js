const XLSX = require("xlsx");
const path = require("path");

function processExcel(inputFilePath, outputFilePath) {
  try {
    // 读取 Excel 文件
    const workbook = XLSX.readFile(inputFilePath);

    // 获取“明细”页签
    const detailSheetName = "明细";
    const detailSheet = workbook.Sheets[detailSheetName];
    if (!detailSheet) {
      throw new Error("未找到“明细”页签");
    }

    // 转换“明细”页签为二维数组
    const detailData = XLSX.utils.sheet_to_json(detailSheet, { header: 1 });

    // 获取标题列索引
    const headerRow = detailData[0];
    const titleColumnIndex = headerRow.indexOf("标题");
    if (titleColumnIndex === -1) {
      throw new Error("“明细”页签未找到“标题”字段");
    }

    // 初始化记录 sheet 名称的计数
    const sheetNameCount = {};

    // 在“明细”页最后一列新增“链接”列
    const linkColumnIndex = headerRow.length;
    detailData[0].push("链接");

    // 遍历“明细”数据，生成 Sheet 页并添加链接
    for (let i = 1; i < detailData.length; i++) {
      const row = detailData[i];
      const title = row[titleColumnIndex];
      if (!title) continue;

      // 生成唯一的 sheet 名称
      let sheetName = title.toString();
      if (sheetNameCount[sheetName]) {
        sheetNameCount[sheetName] += 1;
        sheetName = `${sheetName}_${sheetNameCount[sheetName]}`;
      } else {
        sheetNameCount[sheetName] = 1;
      }

      // 创建新的 Sheet 页
      const newSheetData = [[`这是 ${sheetName} 页`]]; // 自定义 Sheet 内容
      const newSheet = XLSX.utils.aoa_to_sheet(newSheetData);

      // 将新 Sheet 页添加到工作簿
      XLSX.utils.book_append_sheet(workbook, newSheet, sheetName);

      // 在“明细”页签最后一列添加链接
      const link = `#${sheetName}!A1`;
      row[linkColumnIndex] = { t: "s", v: sheetName, l: { Target: link } }; // 超链接格式
    }

    // 将更新的“明细”数据写回原 Sheet
    const updatedDetailSheet = XLSX.utils.aoa_to_sheet(detailData);
    workbook.Sheets[detailSheetName] = updatedDetailSheet;

    // 保存新的 Excel 文件
    XLSX.writeFile(workbook, outputFilePath);
    console.log(`处理完成，文件已保存至：${outputFilePath}`);
  } catch (error) {
    console.error("处理 Excel 文件时发生错误：", error.message);
  }
}

// 示例使用
const inputFilePath = path.join(__dirname, "input.xlsx"); // 输入文件路径
const outputFilePath = path.join(__dirname, "output.xlsx"); // 输出文件路径
processExcel(inputFilePath, outputFilePath);
