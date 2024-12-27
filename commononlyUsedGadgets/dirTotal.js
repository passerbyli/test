const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

/**
 * 递归遍历目录，获取文件信息
 * @param {*} dir
 * @param {*} fileList
 * @returns
 */
function traverseDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      traverseDir(filePath, fileList); // 递归子目录
    } else {
      fileList.push(filePath); // 添加文件路径到列表
    }
  });
  return fileList;
}

/**
 * 统计文件行数
 * @param {*} filePath
 * @returns
 */
function getFileLines(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split(/\r\n|\r|\n/).length;
    return lines;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return 0;
  }
}

/**
 * 获取文件信息并生成统计数据
 * @param {*} filePaths
 * @returns
 */
function generateFileStats(filePaths) {
  return filePaths.map((filePath) => {
    const ext = path.extname(filePath); // 获取文件后缀
    // fs.statSync 是 Node.js 的文件系统模块 (fs) 中的一个同步方法，用于获取文件或目录的状态信息。
    // 它返回一个 fs.Stats 对象，该对象包含了文件或目录的详细信息
    // 例如大小、创建时间、修改时间、是否是文件还是目录等。
    const stat = fs.statSync(filePath); // 获取文件大小

    console.log("文件大小:", stat.size); // 文件的字节大小
    console.log("是否是文件:", stat.isFile()); // 判断是否是文件
    console.log("是否是目录:", stat.isDirectory()); // 判断是否是目录
    console.log("创建时间:", stat.birthtime); // 文件的创建时间
    console.log("修改时间:", stat.mtime); // 文件的修改时间

    const fileSize = stat.size; // 文件大小
    const lineCount = getFileLines(filePath); // 获取行数
    return {
      filePath,
      format: ext,
      lines: lineCount,
      size: fileSize,
    };
  });
}

/**
 * 将数据写入Excel
 * @param {*} fileStats
 * @param {*} outputPath
 */
function writeDataToExcel(fileStats, outputPath) {
  const worksheetData = [
    ["File Path", "File Format", "Lines", "Size (bytes)"], // Excel表头
    ...fileStats.map((file) => [
      file.filePath,
      file.format,
      file.lines,
      file.size,
    ]),
  ];

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
  xlsx.utils.book_append_sheet(workbook, worksheet, "File Stats");
  xlsx.writeFile(workbook, outputPath);
  console.log(`Excel file has been generated at: ${outputPath}`);
}

// 主函数
function main() {
  const targetDir = path.join(__dirname, "your_directory"); // 替换为你的目录路径
  const outputPath = path.join(__dirname, "file_stats.xlsx"); // 生成的Excel文件路径

  // 遍历目录并获取文件列表
  const filePaths = traverseDir(targetDir);

  // 生成文件统计数据
  const fileStats = generateFileStats(filePaths);

  // 将统计数据写入Excel
  writeDataToExcel(fileStats, outputPath);
}

main();
