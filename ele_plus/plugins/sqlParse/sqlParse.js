const fs = require('fs')
const path = require('path')

/**
 * 检测 SQL 语句的数据库类型
 * @param {string} sqlContent - SQL 语句内容
 * @returns {string} - 数据库类型
 */
function detectDatabaseType(sqlContent) {
  if (/ENGINE\s*=\s*InnoDB|AUTO_INCREMENT|DELIMITER/i.test(sqlContent)) {
    return 'MySQL'
  } else if (/IDENTITY|GO|NVARCHAR/i.test(sqlContent)) {
    return 'SQL Server'
  } else if (/BEGIN|END|VARCHAR2|PL\/SQL/i.test(sqlContent)) {
    return 'Oracle'
  } else if (/SERIAL|BIGSERIAL|RETURNING/i.test(sqlContent)) {
    return 'PostgreSQL'
  }
  return 'Unknown'
}

/**
 * 递归获取指定目录下的所有 SQL 文件
 * @param {string} dir - 目录路径
 * @returns {string[]} - SQL 文件路径数组
 */
function getSqlFiles(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat && stat.isDirectory()) {
      // 如果是文件夹，递归遍历
      results = results.concat(getSqlFiles(filePath))
    } else if (path.extname(file) === '.sql') {
      results.push(filePath) // 仅添加 SQL 文件
    }
  })
  return results
}

/**
 * 移除 SQL 语句中的注释
 * @param {string} sql - SQL 语句
 * @returns {string} - 移除注释后的 SQL 语句
 */
function removeComments(sql) {
  // 移除单行注释（以 -- 开头的部分）
  sql = sql.replace(/--.*$/gm, '')

  // 移除多行注释（以 /* 开始，*/ 结束的部分）
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, '')
  return sql
}

/**
 * 判断是否是临时表
 * @param {*} sql
 * @param {*} tableName
 * @returns
 */
function isTemporaryTable(sql, tableName) {
  const tempPattern = /\bTEMP(ORARY)?\s+TABLE\b/gi
  return tempPattern.test(sql) || tableName?.toLowerCase().startsWith('temp_')
}

/**
 * 判断是否是 WITH 子句中的临时表
 * @param {*} sql
 * @param {*} tableName
 * @returns
 */
function isWithTempTable(sql, tableName) {
  // 匹配所有 WITH 子句，并获取其中的每个临时表的定义
  const withPattern = /\bWITH\b[\s\S]*?\s+\bAS\b/gi
  let match
  while ((match = withPattern.exec(sql)) !== null) {
    // 查找每个 CTE（公共表表达式）名及其定义
    const ctePattern = /\b([a-zA-Z0-9_]+)\s+AS\s+\(\s*SELECT/gi
    let cteMatch
    while ((cteMatch = ctePattern.exec(match[0])) !== null) {
      // 判断 CTE 是否是临时表
      const cteName = cteMatch[1]
      // 此处假设临时表名在某些情况下可能包含 "tmp" 或其他特征来区分
      if (cteName.toLowerCase().includes('tmp') || sql.toLowerCase().includes('temporary')) {
        return true // 判断为临时表
      }
    }
  }
  return false // 否则认为不是临时表
}

/**
 * 解析 SQL 脚本
 * 识别源表、目标表、存储过程和函数名
 * @param {string} sqlContent - SQL 脚本内容
 * @returns {Object} - 解析结果
 */
function parseSql(sqlContent) {
  const sourceTables = []
  const targetTables = []
  const procedures = []
  const functionNames = []

  // 移除注释
  sqlContent = removeComments(sqlContent)

  // 匹配 CREATE PROCEDURE 或 CREATE FUNCTION
  // 修改后的正则表达式
  const procedureRegex =
    /CREATE\s+(OR\s+REPLACE\s+)?(PROCEDURE|FUNCTION)\s+([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/gi

  // 匹配 SELECT、INSERT INTO、UPDATE、DELETE 中的表
  // 修改 fromRegex 排除 DELETE FROM
  const fromRegex = /FROM\s+(?!DELETE\s+FROM\s+)([a-zA-Z0-9_\.]+)/gi
  const insertIntoRegex = /INSERT\s+INTO\s+([a-zA-Z0-9_\.]+)/gi
  const updateRegex = /UPDATE\s+([a-zA-Z0-9_\.]+)/gi
  const deleteFromRegex = /DELETE\s+FROM\s+([a-zA-Z0-9_\.]+)/gi

  // 匹配 JOIN 操作中的表
  const joinRegex = /JOIN\s+([a-zA-Z0-9_\.]+)/gi

  // 匹配 MERGE 操作中的表
  const mergeRegex = /MERGE\s+INTO\s+([a-zA-Z0-9_\.]+)/gi
  const usingRegex = /USING\s+([a-zA-Z0-9_\.]+)/gi

  // 匹配 UNION 操作中的表
  const unionRegex = /SELECT\s+.*\s+FROM\s+([a-zA-Z0-9_\.]+)/gi

  let match

  while ((match = procedureRegex.exec(sqlContent)) !== null) {
    const schemaName = match[3] // 提取 schema 名称
    const procedureName = match[4] // 提取存储过程/函数名称
    if (match[2].toUpperCase() === 'PROCEDURE') {
      procedures.push({
        type: 'PROCEDURE',
        schema: schemaName,
        name: procedureName,
      })
    } else {
      functionNames.push({
        type: 'FUNCTION',
        schema: schemaName,
        name: procedureName,
      })
    }
  }

  // 查找所有表名（包括 schema 和表名）
  while ((match = fromRegex.exec(sqlContent)) !== null) {
    const fullTableName = match[1]
    const [schema, table] = fullTableName.split('.')
    const isTemp = isTemporaryTable(sqlContent, table) || isWithTempTable(sqlContent, table)
    sourceTables.push({
      schema: schema || 'public',
      table,
      isTemporary: isTemp,
    })
  }
  while ((match = insertIntoRegex.exec(sqlContent)) !== null) {
    const fullTableName = match[1]
    const [schema, table] = fullTableName.split('.')
    const isTemp = isTemporaryTable(sqlContent, table) || isWithTempTable(sqlContent, table)
    targetTables.push({
      schema: schema || 'public',
      table,
      isTemporary: isTemp,
    })
  }
  while ((match = updateRegex.exec(sqlContent)) !== null) {
    const fullTableName = match[1]
    const [schema, table] = fullTableName.split('.')
    const isTemp = isTemporaryTable(sqlContent, table) || isWithTempTable(sqlContent, table)
    targetTables.push({
      schema: schema || 'public',
      table,
      isTemporary: isTemp,
    })
  }
  while ((match = deleteFromRegex.exec(sqlContent)) !== null) {
    const fullTableName = match[1]
    const [schema, table] = fullTableName.split('.')
    const isTemp = isTemporaryTable(sqlContent, table) || isWithTempTable(sqlContent, table)
    sourceTables.push({
      schema: schema || 'public',
      table,
      isTemporary: isTemp,
    })
  }

  // 查找 JOIN 操作中的表
  while ((match = joinRegex.exec(sqlContent)) !== null) {
    const fullTableName = match[1]
    const [schema, table] = fullTableName.split('.')
    const isTemp = isTemporaryTable(sqlContent, table) || isWithTempTable(sqlContent, table)
    sourceTables.push({
      schema: schema || 'public',
      table,
      isTemporary: isTemp,
    })
  }

  // 查找 MERGE 操作中的源表和目标表
  while ((match = mergeRegex.exec(sqlContent)) !== null) {
    const fullTableName = match[1]
    const [schema, table] = fullTableName.split('.')
    const isTemp = isTemporaryTable(sqlContent, table) || isWithTempTable(sqlContent, table)
    targetTables.push({
      schema: schema || 'public',
      table,
      isTemporary: isTemp,
    })
  }
  while ((match = usingRegex.exec(sqlContent)) !== null) {
    const fullTableName = match[1]
    const [schema, table] = fullTableName.split('.')
    const isTemp = isTemporaryTable(sqlContent, table) || isWithTempTable(sqlContent, table)
    sourceTables.push({
      schema: schema || 'public',
      table,
      isTemporary: isTemp,
    })
  }

  // 查找 UNION 操作中的表
  while ((match = unionRegex.exec(sqlContent)) !== null) {
    const fullTableName = match[1]
    const [schema, table] = fullTableName.split('.')
    const isTemp = isTemporaryTable(sqlContent, table) || isWithTempTable(sqlContent, table)
    sourceTables.push({
      schema: schema || 'public',
      table,
      isTemporary: isTemp,
    })
  }

  return { procedures, functionNames, sourceTables, targetTables }
}

/**
 * 主入口函数
 * @param {string} filePath - SQL 文件或目录路径
 */
async function main(filePath) {
  const sqlFiles = getSqlFiles(filePath)
  const result = []

  sqlFiles.forEach((file, index) => {
    const fileName = path.basename(file)
    const sqlContent = fs.readFileSync(file, 'utf8')
    const databaseType = detectDatabaseType(sqlContent)

    const { procedures, functionNames, sourceTables, targetTables } = parseSql(sqlContent)

    // 如果有有效数据，则加入最终结果
    if (procedures.length || functionNames.length || sourceTables.length || targetTables.length) {
      result.push({
        file, // 文件路径（包括目录）
        scriptIndex: index + 1,
        procedures,
        functionNames,
        sourceTables,
        targetTables,
      })
    }
  })
  return result
}

module.exports = {
  main,
  parseSql,
  getSqlFiles,
  removeComments,
}

main('./sql')
