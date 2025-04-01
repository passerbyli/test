const fs = require("fs");
const path = require("path");

/**
 * 检测 SQL 语句的数据库类型
 * @param {string} sqlContent - SQL 语句内容
 * @returns {string} - 数据库类型
 */
function detectDatabaseType(sqlContent) {
  if (/ENGINE\s*=\s*InnoDB|AUTO_INCREMENT|DELIMITER/i.test(sqlContent)) {
    return "MySQL";
  } else if (/IDENTITY|GO|NVARCHAR/i.test(sqlContent)) {
    return "SQL Server";
  } else if (/BEGIN|END|VARCHAR2|PL\/SQL/i.test(sqlContent)) {
    return "Oracle";
  } else if (/SERIAL|BIGSERIAL|RETURNING/i.test(sqlContent)) {
    return "PostgreSQL";
  }
  return "Unknown";
}

/**
 * 递归获取指定目录下的所有 SQL 文件
 * @param {string} dir - 目录路径
 * @returns {string[]} - SQL 文件路径数组
 */
const getSqlFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // 如果是文件夹，递归遍历
      results = results.concat(getSqlFiles(filePath));
    } else if (path.extname(file) === ".sql") {
      results.push(filePath); // 仅添加 SQL 文件
    }
  });
  return results;
};

/**
 * 移除 SQL 语句中的注释
 * @param {string} sql - SQL 语句
 * @returns {string} - 移除注释后的 SQL 语句
 */
const removeComments = (sql) => {
  // 移除单行注释（以 -- 开头的部分）
  sql = sql.replace(/--.*$/gm, "");

  // 移除多行注释（以 /* 开始，*/ 结束的部分）
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, "");
  return sql;
};

module.exports = {
  getSqlFiles,
  removeComments,
};
