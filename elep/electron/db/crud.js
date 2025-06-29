const { Pool } = require('pg')
const mysql = require('mysql2/promise')
const { v4: uuidv4 } = require('uuid')
const config = require('./config.json')

const dbMap = {}

function getDb(dbName) {
  const dbConfig = config[dbName]
  if (!dbConfig) throw new Error(`数据源 ${dbName} 未配置`)

  if (!dbMap[dbName]) {
    if (dbConfig.type === 'postgres') {
      dbMap[dbName] = new Pool(dbConfig)
    } else if (dbConfig.type === 'mysql') {
      dbMap[dbName] = mysql.createPool(dbConfig)
    } else {
      throw new Error(`不支持的数据源类型: ${dbConfig.type}`)
    }
  }

  return dbMap[dbName]
}

/**
 * 工具函数：生成完整表名（含 schema）
 * @param {*} dbType
 * @param {*} schema
 * @param {*} table
 * @returns
 */
function formatTable(dbType, schema, table) {
  if (!schema) throw new Error('缺少 schema 参数')

  if (dbType === 'postgres') {
    return `"${schema}"."${table}"`
  } else if (dbType === 'mysql') {
    return `\`${schema}\`.\`${table}\``
  } else {
    throw new Error(`不支持的数据库类型: ${dbType}`)
  }
}

/**
 * 通用查询
 * @param {*} dbName 数据名称
 * @param {*} sql 执行sql脚本
 * @param {*} params 执行参数
 * @returns
 */
async function query(dbName, sql, params = []) {
  const db = getDb(dbName)
  const dbType = config[dbName].type

  if (dbType === 'postgres') {
    const res = await db.query(sql, params)
    return res.rows
  } else {
    const [rows] = await db.execute(sql, params)
    return rows
  }
}

// 分页查询
async function queryWithPagination(dbName, schema, baseSql, params = [], { page = 1, pageSize = 20 } = {}) {
  const db = getDb(dbName)
  const dbType = config[dbName].type
  const offset = (page - 1) * pageSize

  let countSql = `SELECT COUNT(*) AS total FROM (${baseSql}) AS t`
  let dataSql = `${baseSql} LIMIT ? OFFSET ?`
  const allParams = [...params, pageSize, offset]

  if (dbType === 'postgres') {
    countSql = `SELECT COUNT(*) FROM (${baseSql}) AS t`
    dataSql = `${baseSql} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
  }

  const totalRes = await query(dbName, countSql, params)
  const total = dbType === 'postgres' ? parseInt(totalRes[0].count, 10) : totalRes[0].total
  const data = await query(dbName, dataSql, allParams)

  return { total, data }
}

/**
 * 插入
 * @param {*} dbName
 * @param {*} schema
 * @param {*} table
 * @param {*} data
 * @returns
 */
async function insert(dbName, schema, table, data) {
  const dbType = config[dbName].type
  const keys = Object.keys(data)
  const values = Object.values(data)
  const fullTable = formatTable(dbType, schema, table)

  if (dbType === 'postgres') {
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
    const sql = `INSERT INTO ${fullTable} (${keys.map(k => `"${k}"`).join(',')}) VALUES (${placeholders}) RETURNING *`
    const rows = await query(dbName, sql, values)
    return rows[0]
  } else {
    const placeholders = keys.map(() => '?').join(', ')
    const sql = `INSERT INTO ${fullTable} (${keys.join(',')}) VALUES (${placeholders})`
    const res = await query(dbName, sql, values)
    return res.insertId ? { id: res.insertId, ...data } : res[0]
  }
}

// 更新
async function update(dbName, schema, table, data, condition = {}) {
  const dbType = config[dbName].type
  const keys = Object.keys(data)
  const values = Object.values(data)
  const condKeys = Object.keys(condition)
  const condValues = Object.values(condition)

  if (!condKeys.length) throw new Error('Update 条件不能为空')

  let setClause, condClause
  if (dbType === 'postgres') {
    setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ')
    condClause = condKeys.map((k, i) => `"${k}" = $${i + 1 + keys.length}`).join(' AND ')
  } else {
    setClause = keys.map(k => `\`${k}\` = ?`).join(', ')
    condClause = condKeys.map(k => `\`${k}\` = ?`).join(' AND ')
  }

  const sql = `UPDATE ${formatTable(dbType, schema, table)} SET ${setClause} WHERE ${condClause}`
  const rows = await query(dbName, sql, [...values, ...condValues])
  return rows[0]
}

// 删除
async function remove(dbName, schema, table, condition = {}) {
  const dbType = config[dbName].type
  const condKeys = Object.keys(condition)
  const condValues = Object.values(condition)

  if (!condKeys.length) throw new Error('Delete 条件不能为空')

  const condClause = condKeys.map((k, i) => (dbType === 'postgres' ? `"${k}" = $${i + 1}` : `\`${k}\` = ?`)).join(' AND ')

  const sql = `DELETE FROM ${formatTable(dbType, schema, table)} WHERE ${condClause}`
  await query(dbName, sql, condValues)
  return true
}

module.exports = {
  query,
  queryWithPagination,
  insert,
  update,
  remove
}
