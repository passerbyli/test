const { Pool } = require('pg')
const config = require('./config.json')
const pool = new Pool(config.postgres)

/**
 * 通用分页查询
 */
async function queryWithPagination(baseSql, params = [], { page = 1, pageSize = 20 }) {
  const offset = (page - 1) * pageSize
  const countSql = `SELECT COUNT(*) FROM (${baseSql}) AS total`
  const dataSql = `${baseSql} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`

  const totalRes = await pool.query(countSql, params)
  const dataRes = await pool.query(dataSql, [...params, pageSize, offset])

  return {
    total: parseInt(totalRes.rows[0].count),
    data: dataRes.rows,
  }
}

/**
 * 获取指定字段的去重值
 */
async function getDistinctValues(table, column) {
  const sql = `SELECT DISTINCT ${column} FROM ${table} WHERE ${column} IS NOT NULL ORDER BY ${column}`
  const res = await pool.query(sql)
  return res.rows.map((row) => row[column])
}

/**
 * 查询（非分页）
 */
async function query(sql, params = []) {
  const res = await pool.query(sql, params)
  return res.rows
}

/**
 * 插入
 */
async function insert(table, data) {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const placeholders = keys.map((_, i) => `$${i + 1}`)

  const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders.join(',')}) RETURNING *`
  const res = await pool.query(sql, values)
  return res.rows[0]
}

/**
 * 更新（支持条件）
 */
async function update(table, data, condition = {}) {
  const keys = Object.keys(data)
  const values = Object.values(data)
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')

  const condKeys = Object.keys(condition)
  const condValues = Object.values(condition)
  const condClause = condKeys.map((key, i) => `${key} = $${i + 1 + keys.length}`).join(' AND ')

  const sql = `UPDATE ${table} SET ${setClause} WHERE ${condClause} RETURNING *`
  const res = await pool.query(sql, [...values, ...condValues])
  return res.rows[0]
}

/**
 * 删除（支持条件）
 */
async function remove(table, condition = {}) {
  const condKeys = Object.keys(condition)
  const condValues = Object.values(condition)
  const condClause = condKeys.map((key, i) => `${key} = $${i + 1}`).join(' AND ')

  const sql = `DELETE FROM ${table} WHERE ${condClause}`
  await pool.query(sql, condValues)
  return true
}

module.exports = {
  queryWithPagination,
  getDistinctValues,
  query,
  insert,
  update,
  remove,
}
