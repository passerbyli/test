const fs = require("fs");
const path = require("path");

// 去除单行和多行注释
function removeComments(script) {
  // 移除单行注释（以 -- 开头）
  script = script.replace(/--.*$/gm, "");

  // 移除多行注释（以 /* 开头， */ 结束）
  script = script.replace(/\/\*[\s\S]*?\*\//gm, "");

  return script;
}

// 用于解析 SQL 脚本的函数
function parseSQL(script, filePath) {
  const result = [];

  // 去除注释
  script = removeComments(script);

  // 匹配存储过程或函数（兼容所有 CREATE 格式，包括带方括号）
  const procedureRegex =
    /CREATE\s+(OR\s+REPLACE\s+)?(PROCEDURE|FUNCTION)\s+\[?([a-zA-Z0-9_]+)\]?\.\[?([a-zA-Z0-9_]+)\]?\s*(\([^)]*\))?/gi;
  let match;

  while ((match = procedureRegex.exec(script)) !== null) {
    const type = match[2].toUpperCase(); // PROCEDURE 或 FUNCTION
    const schema = match[3]; // 第一个括号内是 schema
    const name = match[4]; // 第二个括号内是存储过程名称

    let sourceTables = new Set();
    let targetTables = [];

    // 临时表存储数组
    const tempTables = new Set();

    // 1. 查找所有临时表（忽略大小写）
    const tempTableRegex = /CREATE\s+TEMP\s+TABLE\s+([a-zA-Z0-9_]+)/gi;
    let tempMatch;
    while ((tempMatch = tempTableRegex.exec(script)) !== null) {
      tempTables.add(tempMatch[1]);
    }

    // 2. 处理WITH子句中创建的临时表，可以有多个临时表
    const withTempTableRegex = /\b([A-Za-z0-9_-]+)\s+AS\s+\(/gi;
    let withMatch;
    const withTempTables = [];
    while ((withMatch = withTempTableRegex.exec(script)) !== null) {
      withTempTables.push(withMatch[1]);
    }

    // 3. 处理SELECT INTO创建的临时表
    const selectIntoTempTableRegex = /SELECT\s+.*\s+INTO\s+([a-zA-Z0-9_]+)/gi;
    let selectIntoMatch;
    const selectIntoTempTables = [];
    while ((selectIntoMatch = selectIntoTempTableRegex.exec(script)) !== null) {
      selectIntoTempTables.push(selectIntoMatch[1]);
    }

    // 合并临时表列表
    const allTempTables = [
      ...tempTables,
      ...withTempTables,
      ...selectIntoTempTables,
    ];

    // 4. 查找所有源表（FROM, JOIN），处理方括号
    const sourceTableRegex =
      /(FROM|JOIN)\s+([a-zA-Z0-9_\[\]]+(\.[a-zA-Z0-9_\[\]]+)?)/gi;
    let sourceTableMatch;
    while ((sourceTableMatch = sourceTableRegex.exec(script)) !== null) {
      const table = sourceTableMatch[2].replace(/\[|\]/g, ""); // 移除方括号
      const isTemporary = allTempTables.includes(table) ? true : false;
      const schema = table.includes(".") ? table.split(".")[0] : "";
      sourceTables.add(JSON.stringify({ schema, table, isTemporary }));
    }

    // 5. 分别查找目标表的操作类型（INSERT INTO, UPDATE, DELETE FROM, MERGE INTO），并区分操作类型
    const insertTableRegex =
      /INSERT INTO\s+([a-zA-Z0-9_\[\]]+(\.[a-zA-Z0-9_\[\]]+)?)/gi;
    const updateTableRegex =
      /UPDATE\s+([a-zA-Z0-9_\[\]]+(\.[a-zA-Z0-9_\[\]]+)?)(?=\s+SET)/gi; // 修正后的正则
    const deleteTableRegex =
      /DELETE FROM\s+([a-zA-Z0-9_\[\]]+(\.[a-zA-Z0-9_\[\]]+)?)/gi;
    const mergeTableRegex =
      /MERGE INTO\s+([a-zA-Z0-9_\[\]]+(\.[a-zA-Z0-9_\[\]]+)?)/gi;
    const mergeSourceTableRegex =
      /USING\s+([a-zA-Z0-9_\[\]]+(\.[a-zA-Z0-9_\[\]]+)?)/gi;

    let insertMatch;
    let updateMatch;
    let deleteMatch;
    let mergeMatch;
    let mergeSourceMatch;

    // 处理 INSERT INTO 操作的目标表
    while ((insertMatch = insertTableRegex.exec(script)) !== null) {
      const table = insertMatch[1].replace(/\[|\]/g, ""); // 移除方括号
      const schema = table.includes(".") ? table.split(".")[0] : "";
      targetTables.push({ schema, table, operation: "INSERT" });
    }

    // 处理 UPDATE 操作的目标表（修正后的正则表达式）
    while ((updateMatch = updateTableRegex.exec(script)) !== null) {
      const table = updateMatch[1].replace(/\[|\]/g, ""); // 移除方括号
      const schema = table.includes(".") ? table.split(".")[0] : "";
      targetTables.push({ schema, table, operation: "UPDATE" });
    }

    // 处理 DELETE FROM 操作的目标表
    while ((deleteMatch = deleteTableRegex.exec(script)) !== null) {
      const table = deleteMatch[1].replace(/\[|\]/g, ""); // 移除方括号
      const schema = table.includes(".") ? table.split(".")[0] : "";
      targetTables.push({ schema, table, operation: "DELETE" });
    }

    // 处理 MERGE INTO 操作的目标表
    while ((mergeMatch = mergeTableRegex.exec(script)) !== null) {
      const table = mergeMatch[1].replace(/\[|\]/g, ""); // 移除方括号
      const schema = table.includes(".") ? table.split(".")[0] : "";
      targetTables.push({ schema, table, operation: "MERGE" });
    }

    // 处理 MERGE INTO 操作的源表（USING 后的表）
    while ((mergeSourceMatch = mergeSourceTableRegex.exec(script)) !== null) {
      const table = mergeSourceMatch[1].replace(/\[|\]/g, ""); // 移除方括号
      const isTemporary = allTempTables.includes(table) ? true : false;
      const schema = table.includes(".") ? table.split(".")[0] : "";
      sourceTables.add(JSON.stringify({ schema, table, isTemporary }));
    }

    // 将 Set 转换为数组并解析重复数据
    sourceTables = Array.from(sourceTables).map((item) => JSON.parse(item));

    // 将解析结果存入 result 数组，并添加 filePath 属性
    result.push({
      type,
      schema,
      name,
      sourceTables,
      targetTables,
      filePath, // 添加文件路径
    });
  }

  return result;
}

// 递归遍历目录下的所有 .sql 文件
function readSQLFiles(directory) {
  let results = [];

  // 获取目录下的所有文件和文件夹
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 如果是文件夹，递归遍历
      results = results.concat(readSQLFiles(filePath));
    } else if (filePath.endsWith(".sql")) {
      // 如果是 .sql 文件，读取并解析
      const script = fs.readFileSync(filePath, "utf-8");
      const parsedData = parseSQL(script, filePath);
      results = results.concat(parsedData);
    }
  });

  return results;
}

// 指定要遍历的文件夹路径
const folderPath = path.join(__dirname, "/"); // 请根据实际情况修改文件夹路径

// 读取文件夹下的所有 SQL 文件并解析
const parsedData = readSQLFiles(folderPath);

// 输出解析结果
console.log(JSON.stringify(parsedData, null, 2));
