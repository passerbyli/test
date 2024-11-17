// 定义危险操作关键字（大写）
const dangerousKeywords = [
  "DROP",
  "TRUNCATE",
  "DELETE",
  "ALTER",
  "SHUTDOWN",
  "GRANT",
  "REVOKE",
  "EXEC",
];

/**
 * 移除 SQL 脚本中的注释
 * @param {string} sqlScript
 * @returns {string} 去除注释后的 SQL 脚本
 */
function removeComments(sqlScript) {
  return (
    sqlScript
      // 移除单行注释（-- 开头）
      .replace(/--.*$/gm, "")
      // 移除多行注释（/* ... */）
      .replace(/\/\*[\s\S]*?\*\//g, "")
  );
}

/**
 * 精确校验 SQL 是否包含危险关键字
 * @param {string} sqlScript
 * @returns {string} 校验结果
 */
function validateSQLScript(sqlScript) {
  // 移除注释
  const sanitizedScript = removeComments(sqlScript);

  // 将 SQL 脚本按分号拆分为独立语句
  const statements = sanitizedScript
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  // 遍历每一条语句，检测是否包含危险操作
  for (let statement of statements) {
    for (let keyword of dangerousKeywords) {
      // 使用正则匹配，确保是完整关键字（避免误判）
      const regex = new RegExp(`\\b${keyword}\\b`, "i"); // \b 确保匹配完整单词
      if (regex.test(statement)) {
        return `检测到危险操作: "${keyword}"，请检查 SQL 脚本！\n危险语句: ${statement}`;
      }
    }
  }
  return "SQL 脚本校验通过，无危险操作。";
}

// 示例 SQL 脚本
const sqlScript = `
    -- 创建用户表
    CREATE TABLE Users (id INT, name VARCHAR(50));
    
    /* 删除测试用户 */
    DELETE FROM Users WHERE id = 1;
    
    SELECT * FROM Users;
    
    -- DROP 语句测试
    DROP TABLE IF EXISTS Logs;
`;

// 调用校验函数
const result = validateSQLScript(sqlScript);
console.log(result);
