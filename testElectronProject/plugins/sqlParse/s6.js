// 1. 移除 SQL 中的字符串常量和注释
const removeStringLiteralsAndComments = (sql) => {
  return sql.replace(/'[^']*'|`[^`]*`|--[^\n]*|\/\*[\s\S]*?\*\//g, "");
};

// 2. 解析动态拼接的 SQL，提取出所有动态构建的查询
const extractDynamicSQL = (sql) => {
  const dynamicSQLs = [];
  const regex =
    /\b(DECLARE|SET|SELECT|UPDATE|INSERT INTO|DELETE FROM|EXECUTE)\s+[a-zA-Z0-9_]+\s*=\s*[^;]+/g;

  let match;
  while ((match = regex.exec(sql)) !== null) {
    dynamicSQLs.push(match[0]);
  }

  return dynamicSQLs;
};

// 3. 提取 SQL 查询中的表名
const findTablesInSQL = (sql) => {
  // 移除字符串常量和注释
  sql = removeStringLiteralsAndComments(sql);

  // 定义查找表名的正则表达式
  const tableRegex =
    /\bFROM\s+([a-zA-Z0-9_\.]+)|\bJOIN\s+([a-zA-Z0-9_\.]+)|\bINSERT\s+INTO\s+([a-zA-Z0-9_\.]+)/gi;
  const tables = [];

  let match;
  while ((match = tableRegex.exec(sql)) !== null) {
    const table = match[1] || match[2] || match[3];
    const [schema, tableName] = table.split(".");
    tables.push({ schema: schema || "public", table: tableName });
  }

  return tables;
};

// 4. 处理动态 SQL 拼接，提取表名
const processSQL = (sql) => {
  const dynamicSQLs = extractDynamicSQL(sql);
  const tables = [];

  // 解析动态 SQL 拼接后的完整查询
  dynamicSQLs.forEach((dynamicSQL) => {
    // 移除拼接部分中的字符串常量
    const fullSQL = removeStringLiteralsAndComments(dynamicSQL);

    // 提取表名
    const foundTables = findTablesInSQL(fullSQL);
    tables.push(...foundTables);
  });

  return tables;
};

// 示例 SQL 语句
const sql = `
  DECLARE v_sql VARCHAR(100);
  v_sql = 'SELECT attr1, attr2 FROM dm.school WHERE a = 1';
  v_sql = v_sql + ' AND b = 2';
  EXECUTE v_sql;
`;

const tables = processSQL(sql);
console.log(tables);
