const ExcelJS = require("exceljs");
const path = require("path");

async function processExcel(filePath, outputFilePath) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // 获取“明细”页签
    const detailSheet = workbook.getWorksheet("明细");
    if (!detailSheet) {
      throw new Error("未找到“明细”页签");
    }

    // 获取标题列
    const titleColumnIndex = detailSheet
      .getRow(1)
      .values.findIndex((val) => val === "标题");
    if (titleColumnIndex === -1) {
      throw new Error("“明细”页签未找到“标题”字段");
    }

    // 创建新的 sheet 页并生成链接
    const sheetNameCount = {}; // 用于记录重名计数
    const linkColumnIndex = detailSheet.getRow(1).actualCellCount + 1;

    detailSheet.getRow(1).getCell(linkColumnIndex).value = "链接";

    detailSheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return; // 跳过标题行

      const title = row.getCell(titleColumnIndex).value;
      if (!title) return;

      // 处理重名
      let sheetName = title.toString();
      if (sheetNameCount[sheetName]) {
        sheetNameCount[sheetName] += 1;
        sheetName = `${sheetName}_${sheetNameCount[sheetName]}`;
      } else {
        sheetNameCount[sheetName] = 1;
      }

      // 创建新的 sheet 页
      const newSheet = workbook.addWorksheet(sheetName);
      newSheet.getCell("A1").value = `这是 ${sheetName} 页`; // 可自定义内容

      // 在“明细”页签最后一列添加链接
      const cell = row.getCell(linkColumnIndex);

      // 使用单引号包裹 sheet 名称，确保正确格式
      cell.value = {
        text: sheetName,
        hyperlink: `#'${sheetName}'!A1`, // 超链接格式
      };
    });

    // 调整列宽以适配链接
    detailSheet.getColumn(linkColumnIndex).width = 30;

    // 保存新的文件
    await workbook.xlsx.writeFile(outputFilePath);
    console.log(`处理完成，文件已保存至：${outputFilePath}`);
  } catch (error) {
    console.error("处理Excel文件时发生错误：", error.message);
  }
}

async function printHyperlinks(filePath) {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    workbook.eachSheet((worksheet) => {
      console.log(`正在检查 Sheet: ${worksheet.name}`);

      worksheet.eachRow((row, rowIndex) => {
        row.eachCell((cell, colIndex) => {
          // 检查单元格是否有超链接
          if (
            cell.value &&
            typeof cell.value === "object" &&
            cell.value.hyperlink
          ) {
            console.log(
              `行 ${rowIndex}, 列 ${colIndex}: 超链接地址为 ${cell.value.hyperlink}`
            );
          }
        });
      });
    });
  } catch (error) {
    console.error("读取 Excel 文件时发生错误:", error.message);
  }
}

// 示例使用
const inputFilePath = path.join(__dirname, "input.xlsx"); // 输入文件路径
const outputFilePath = path.join(__dirname, "output.xlsx"); // 输出文件路径
// processExcel(inputFilePath, outputFilePath);

printHyperlinks(outputFilePath);
