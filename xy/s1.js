const fs = require("fs");
const path = require("path");

// 遍历文件夹及其子文件夹
const sqlFolderPath = "xy/data"; // 存储 SQL 文件的文件夹

// 递归函数，用于获取所有 SQL 文件的路径
const getSqlFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getSqlFiles(filePath)); // 递归
    } else if (file.endsWith(".sql")) {
      results.push(filePath); // 仅添加 SQL 文件
    }
  });
  return results;
};

// 获取所有 SQL 文件
const sqlFiles = getSqlFiles(sqlFolderPath);

// 读取每个 SQL 文件内容
const sqlScripts = sqlFiles.map((filePath) => {
  return {
    filePath,
    content: fs.readFileSync(filePath, "utf-8"),
  };
});

// 移除注释（单行注释和多行注释）
const removeComments = (sql) => {
  // 移除单行注释（以 -- 开头的部分）
  sql = sql.replace(/--.*$/gm, "");
  // 移除多行注释（以 /* 开始，*/ 结束的部分）
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, "");
  return sql;
};

// 判断是否是临时表
const isTemporaryTable = (sql, tableName) => {
  const tempPattern = /\bTEMP(ORARY)?\s+TABLE\b/gi;
  return tempPattern.test(sql) || tableName.toLowerCase().startsWith("temp_");
};

// 判断是否是 WITH 子句中的临时表
const isWithTempTable = (sql, tableName) => {
  // 匹配所有 WITH 子句，并获取其中的每个临时表的定义
  const withPattern = /\bWITH\b[\s\S]*?\s+\bAS\b/gi;
  let match;
  while ((match = withPattern.exec(sql)) !== null) {
    // 查找每个 CTE（公共表表达式）名及其定义
    const ctePattern = /\b([a-zA-Z0-9_]+)\s+AS\s+\(\s*SELECT/gi;
    let cteMatch;
    while ((cteMatch = ctePattern.exec(match[0])) !== null) {
      // 判断 CTE 是否是临时表
      const cteName = cteMatch[1];
      // 此处假设临时表名在某些情况下可能包含 "tmp" 或其他特征来区分
      if (
        cteName.toLowerCase().includes("tmp") ||
        sql.toLowerCase().includes("temporary")
      ) {
        return true; // 判断为临时表
      }
    }
  }
  return false; // 否则认为不是临时表
};

// 解析 SQL 文件中的存储过程、表和 schema
const parseSQL = (sql) => {
  const sourceTables = [];
  const targetTables = [];
  const procedures = [];
  const functionNames = [];

  // 移除注释
  sql = removeComments(sql);

  // 匹配 CREATE PROCEDURE 或 CREATE FUNCTION
  // 修改后的正则表达式
  const procedureRegex =
    /CREATE\s+(OR\s+REPLACE\s+)?(PROCEDURE|FUNCTION)\s+([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/gi;

  // 匹配 SELECT、INSERT INTO、UPDATE、DELETE 中的表
  // 修改 fromRegex 排除 DELETE FROM
  const fromRegex = /FROM\s+(?!DELETE\s+FROM\s+)([a-zA-Z0-9_\.]+)/gi;
  const insertIntoRegex = /INSERT\s+INTO\s+([a-zA-Z0-9_\.]+)/gi;
  const updateRegex = /UPDATE\s+([a-zA-Z0-9_\.]+)/gi;
  const deleteFromRegex = /DELETE\s+FROM\s+([a-zA-Z0-9_\.]+)/gi;

  // 匹配 JOIN 操作中的表
  const joinRegex = /JOIN\s+([a-zA-Z0-9_\.]+)/gi;

  // 匹配 MERGE 操作中的表
  const mergeRegex = /MERGE\s+INTO\s+([a-zA-Z0-9_\.]+)/gi;
  const usingRegex = /USING\s+([a-zA-Z0-9_\.]+)/gi;

  // 匹配 UNION 操作中的表
  const unionRegex = /SELECT\s+.*\s+FROM\s+([a-zA-Z0-9_\.]+)/gi;

  let match;

  while ((match = procedureRegex.exec(sql)) !== null) {
    const schemaName = match[3]; // 提取 schema 名称
    const procedureName = match[4]; // 提取存储过程/函数名称
    if (match[2].toUpperCase() === "PROCEDURE") {
      procedures.push({
        type: "PROCEDURE",
        schema: schemaName,
        name: procedureName,
      });
    } else {
      functionNames.push({
        type: "FUNCTION",
        schema: schemaName,
        name: procedureName,
      });
    }
  }

  // 查找所有表名（包括 schema 和表名）
  while ((match = fromRegex.exec(sql)) !== null) {
    const fullTableName = match[1];
    const [schema, table] = fullTableName.split(".");
    const isTemp = isTemporaryTable(sql, table) || isWithTempTable(sql, table);
    sourceTables.push({
      schema: schema || "public",
      table,
      isTemporary: isTemp,
    });
  }
  while ((match = insertIntoRegex.exec(sql)) !== null) {
    const fullTableName = match[1];
    const [schema, table] = fullTableName.split(".");
    const isTemp = isTemporaryTable(sql, table) || isWithTempTable(sql, table);
    targetTables.push({
      schema: schema || "public",
      table,
      isTemporary: isTemp,
    });
  }
  while ((match = updateRegex.exec(sql)) !== null) {
    const fullTableName = match[1];
    const [schema, table] = fullTableName.split(".");
    const isTemp = isTemporaryTable(sql, table) || isWithTempTable(sql, table);
    targetTables.push({
      schema: schema || "public",
      table,
      isTemporary: isTemp,
    });
  }
  while ((match = deleteFromRegex.exec(sql)) !== null) {
    const fullTableName = match[1];
    const [schema, table] = fullTableName.split(".");
    const isTemp = isTemporaryTable(sql, table) || isWithTempTable(sql, table);
    sourceTables.push({
      schema: schema || "public",
      table,
      isTemporary: isTemp,
    });
  }

  // 查找 JOIN 操作中的表
  while ((match = joinRegex.exec(sql)) !== null) {
    const fullTableName = match[1];
    const [schema, table] = fullTableName.split(".");
    const isTemp = isTemporaryTable(sql, table) || isWithTempTable(sql, table);
    sourceTables.push({
      schema: schema || "public",
      table,
      isTemporary: isTemp,
    });
  }

  // 查找 MERGE 操作中的源表和目标表
  while ((match = mergeRegex.exec(sql)) !== null) {
    const fullTableName = match[1];
    const [schema, table] = fullTableName.split(".");
    const isTemp = isTemporaryTable(sql, table) || isWithTempTable(sql, table);
    targetTables.push({
      schema: schema || "public",
      table,
      isTemporary: isTemp,
    });
  }
  while ((match = usingRegex.exec(sql)) !== null) {
    const fullTableName = match[1];
    const [schema, table] = fullTableName.split(".");
    const isTemp = isTemporaryTable(sql, table) || isWithTempTable(sql, table);
    sourceTables.push({
      schema: schema || "public",
      table,
      isTemporary: isTemp,
    });
  }

  // 查找 UNION 操作中的表
  while ((match = unionRegex.exec(sql)) !== null) {
    const fullTableName = match[1];
    const [schema, table] = fullTableName.split(".");
    const isTemp = isTemporaryTable(sql, table) || isWithTempTable(sql, table);
    sourceTables.push({
      schema: schema || "public",
      table,
      isTemporary: isTemp,
    });
  }

  return { procedures, functionNames, sourceTables, targetTables };
};

// 解析所有 SQL 脚本
const result = [];

sqlScripts.forEach(({ filePath, content }, index) => {
  const { procedures, functionNames, sourceTables, targetTables } =
    parseSQL(content);

  // 如果有存储过程、函数、源表或目标表，记录到结果数组
  if (
    procedures.length > 0 ||
    functionNames.length > 0 ||
    sourceTables.length > 0 ||
    targetTables.length > 0
  ) {
    result.push({
      filePath, // 文件路径（包括目录）
      scriptIndex: index + 1,
      procedures,
      functionNames,
      sourceTables,
      targetTables,
    });
  }
});

// 将结果保存为 JSON 文件
fs.writeFileSync(
  "./tables_and_procs_with_temp_flag.json",
  JSON.stringify(result, null, 2)
);
console.log(
  "SQL tables and procedures information saved to tables_and_procs_with_temp_flag.json"
);
