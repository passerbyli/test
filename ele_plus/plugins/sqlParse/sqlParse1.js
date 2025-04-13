const fs = require('fs')
const path = require('path')

// SQL 保留字，避免误识别为表名
const SQL_KEYWORDS = new Set([
  'select',
  'insert',
  'update',
  'delete',
  'set',
  'from',
  'where',
  'join',
  'on',
  'using',
  'with',
  'into',
  'values',
  'union',
  'intersect',
  'except',
  'group',
  'order',
  'by',
  'limit',
  'offset',
  'create',
  'drop',
  'alter',
])

function isValidTableName(name) {
  return name && !SQL_KEYWORDS.has(name.toLowerCase())
}

// 检测数据库类型
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
 * 去除注释
 * @param {*} sql
 * @returns
 */
function removeComments(sql) {
  sql = sql.replace(/--.*$/gm, '')
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, '')
  return sql
}

// 提取 WITH 子句中的所有 CTE 名称
function getCTENames(sql) {
  const lowered = sql.toLowerCase()
  const names = []

  const withMatch = lowered.match(/\bwith\b\s+(.*)/is)
  if (!withMatch) return names

  let remaining = withMatch[1]
  let index = 0
  const length = remaining.length

  while (index < length) {
    const nameMatch = remaining.slice(index).match(/^([a-zA-Z0-9_]+)\s+as\s*\(/i)
    if (!nameMatch) break

    const cteName = nameMatch[1]
    names.push(cteName)
    index += nameMatch[0].length

    // 跳过括号内容（平衡括号）
    let depth = 1
    while (index < length && depth > 0) {
      if (remaining[index] === '(') depth++
      else if (remaining[index] === ')') depth--
      index++
    }

    while (index < length && /[\s,]/.test(remaining[index])) index++
  }

  return names
}

// 判断是否为临时表（4条规则）
function isTemporaryTableAccurate(sql, tableName, schema) {
  const loweredSql = sql.toLowerCase()
  const loweredTable = tableName.toLowerCase()

  const createTempRegex = new RegExp(
    `create\\s+(global\\s+)?temp(orary)?\\s+table\\s+["'\`]?${loweredTable}["'\`]?[\\s\\(]`,
    'i',
  )
  if (createTempRegex.test(loweredSql)) return true

  const cteNames = getCTENames(sql)
  if (cteNames.includes(loweredTable)) return true

  if (loweredTable.startsWith('temp_') || loweredTable.includes('tmp')) return true

  // ✅ 默认没有 schema 的认为是临时表
  if (!schema || schema.toLowerCase() === 'public') return true

  return false
}

// 去重工具
function deduplicateTables(tables) {
  const seen = new Set()
  return tables.filter(({ schema, table }) => {
    const key = `${schema}.${table}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// 主解析函数
function parseSql(sqlContent) {
  const sourceTables = []
  const targetTables = []
  const procedures = []
  const functionNames = []

  const nodes = []
  const edges = []

  let isSwitchTable = false

  sqlContent = removeComments(sqlContent)

  const patterns = [
    { type: 'source', regex: /(?<!delete\s)from\s+([a-zA-Z0-9_\.]+)/gi },
    { type: 'source', regex: /join\s+([a-zA-Z0-9_\.]+)/gi },
    { type: 'source', regex: /using\s+([a-zA-Z0-9_\.]+)/gi },
    { type: 'target', regex: /delete\s+from\s+([a-zA-Z0-9_\.]+)/gi }, // ✅ delete 单独作为目标表
    { type: 'target', regex: /insert\s+into\s+([a-zA-Z0-9_\.]+)/gi },
    { type: 'target', regex: /update\s+([a-zA-Z0-9_\.]+)/gi },
    { type: 'target', regex: /merge\s+into\s+([a-zA-Z0-9_\.]+)/gi },
    { type: 'target', regex: /select\s+.*?\s+into\s+([a-zA-Z0-9_\.]+)/gi },
    { type: 'source', regex: /select\s+.*?\s+from\s+([a-zA-Z0-9_\.]+)/gi },
  ]

  for (const { type, regex } of patterns) {
    let match
    while ((match = regex.exec(sqlContent)) !== null) {
      const full = match[1]
      const [schema = '', table] = full.includes('.') ? full.split('.') : ['', full]

      if (!isValidTableName(table)) continue

      const entry = {
        schema: schema || 'public',
        table,
        isTemporary: isTemporaryTableAccurate(sqlContent, table, schema),
      }

      if (type === 'source') sourceTables.push(entry)
      else targetTables.push(entry)
    }
  }

  // 提取函数/存储过程
  const procedureRegex =
    /CREATE\s+(OR\s+REPLACE\s+)?(PROCEDURE|FUNCTION)\s+([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/gi

  let match
  while ((match = procedureRegex.exec(sqlContent)) !== null) {
    const schemaName = match[3]
    const name = match[4]
    if (match[2].toUpperCase() === 'PROCEDURE') {
      procedures.push({ type: 'PROCEDURE', schema: schemaName, name })
    } else {
      functionNames.push({ type: 'FUNCTION', schema: schemaName, name })
    }
  }

  return {
    nodes,
    edges,
    isSwitchTable: isSwitchTable,
    dbType: detectDatabaseType(sqlContent),
    procedures,
    functionNames,
    sourceTables: deduplicateTables(sourceTables),
    targetTables: deduplicateTables(targetTables),
  }
}

module.exports = {
  parseSql,
}
