#!/usr/bin/env node
/**
 * 读取当前目录 ./swagger.json，解析后写入 PostgreSQL（两张表：api_endpoint + api_field）
 *
 * 依赖：
 *   npm i pg
 *
 * 配置：
 *   db.config.json 同目录（见示例）
 */

const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

// ---------- 配置 ----------
const INPUT = path.resolve(process.cwd(), 'swagger.json')
const CONF_PATH = path.resolve(process.cwd(), 'db.config.json')

if (!fs.existsSync(CONF_PATH)) {
  console.error('缺少 db.config.json，请先创建配置文件。')
  process.exit(1)
}
const CONF = JSON.parse(fs.readFileSync(CONF_PATH, 'utf-8'))
const pool = new Pool(CONF.postgres)

if (!fs.existsSync(INPUT)) {
  console.error('未找到 swagger.json，请放在当前目录。')
  process.exit(1)
}
const DOC = JSON.parse(fs.readFileSync(INPUT, 'utf-8'))

// ---------- SQL ----------
const SQL = {
  ensure: `
  CREATE TABLE IF NOT EXISTS api_endpoint (
    id           BIGSERIAL PRIMARY KEY,
    method       VARCHAR(10) NOT NULL,
    path         TEXT        NOT NULL,
    name         TEXT        NOT NULL,
    summary      TEXT        NULL,
    description  TEXT        NULL,
    operation_id TEXT        NULL,
    tag          TEXT        NULL,
    UNIQUE (method, path)
  );

  CREATE TABLE IF NOT EXISTS api_field (
    id          BIGSERIAL PRIMARY KEY,
    api_id      BIGINT      NOT NULL REFERENCES api_endpoint(id) ON DELETE CASCADE,
    io          VARCHAR(16) NOT NULL,
    location    VARCHAR(16) NOT NULL,
    field_path  TEXT        NOT NULL,
    level       INT         NOT NULL DEFAULT 1,
    type        TEXT        NULL,
    required    BOOLEAN     NOT NULL DEFAULT FALSE,
    description TEXT        NULL,
    possible    TEXT        NULL
  );

  CREATE INDEX IF NOT EXISTS idx_field_api ON api_field(api_id);
  CREATE INDEX IF NOT EXISTS idx_field_api_io ON api_field(api_id, io);
  `,
  upsertEndpoint: `
    INSERT INTO api_endpoint (method, path, name, summary, description, operation_id, tag)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    ON CONFLICT (method, path) DO UPDATE SET
      name = EXCLUDED.name,
      summary = EXCLUDED.summary,
      description = EXCLUDED.description,
      operation_id = EXCLUDED.operation_id,
      tag = EXCLUDED.tag
    RETURNING id
  `,
  deleteFields: `DELETE FROM api_field WHERE api_id=$1`,
  insertField: `
    INSERT INTO api_field (api_id, io, location, field_path, level, type, required, description, possible)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
  `
}

// ---------- 解析工具 ----------
const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace']
const isOAS3 = !!DOC.openapi
const arrayify = x => (Array.isArray(x) ? x : x ? [x] : [])

function resolveRef(node) {
  if (!node || typeof node !== 'object' || !node.$ref) return node
  const ref = node.$ref
  if (!ref.startsWith('#/')) return node // 不解析外部
  const parts = ref.slice(2).split('/')
  let cur = DOC
  for (const p of parts) {
    cur = cur?.[p]
    if (cur == null) return node
  }
  return cur
}

function schemaToType(schema) {
  if (!schema) return ''
  const s = resolveRef(schema) || {}
  if (s.oneOf) return 'oneOf(' + s.oneOf.map(schemaToType).join(' | ') + ')'
  if (s.anyOf) return 'anyOf(' + s.anyOf.map(schemaToType).join(' | ') + ')'
  if (s.allOf) return 'allOf(' + s.allOf.map(schemaToType).join(' & ') + ')'
  if (s.type === 'array') return `array<${schemaToType(s.items) || 'any'}>`
  if (s.enum) return `enum(${s.enum.map(v => JSON.stringify(v)).join(',')})`
  if (s.format) return `${s.type || 'object'}(${s.format})`
  if (s.type) return s.type
  if (s.properties) return 'object'
  return 'object'
}

function flattenProperties(schema, parent = '', level = 1, rows = []) {
  let s = resolveRef(schema) || {}
  if (s.type === 'array') s = resolveRef(s.items) || {}
  const props = s.properties || {}
  const req = new Set(s.required || [])
  for (const [name, prop0] of Object.entries(props)) {
    const prop = resolveRef(prop0) || {}
    const field = parent ? `${parent}.${name}` : name
    rows.push({
      field_path: field,
      level,
      type: schemaToType(prop),
      required: req.has(name),
      description: prop.description || '',
      possible: Array.isArray(prop.enum) ? prop.enum.map(String).join(',') : ''
    })
    // 嵌套 object
    if (prop.type === 'object' || prop.properties) flattenProperties(prop, field, level + 1, rows)
    // 数组对象
    if (prop.type === 'array') {
      const it = resolveRef(prop.items) || {}
      if (it.type === 'object' || it.properties) flattenProperties(it, field + '[]', level + 1, rows)
    }
  }
  return rows
}

function collectParameters(pathItem, op) {
  const list = [...arrayify(pathItem.parameters), ...arrayify(op.parameters)].filter(Boolean)
  return list.map(p => ({
    io: 'param',
    location: p.in || '',
    field_path: p.name || '',
    level: 1,
    type: schemaToType(p.schema) || p.type || '',
    required: !!p.required,
    description: p.description || '',
    possible: '' // 参数级别一般不直接挂 enum，这里如需可扩展
  }))
}

function extractRequestBodySchema(op) {
  if (isOAS3) {
    const rb = op.requestBody
    if (!rb || !rb.content) return null
    const c = rb.content
    const ct = c['application/json'] ? 'application/json' : Object.keys(c)[0]
    return ct ? c[ct].schema : null
  } else {
    const body = arrayify(op.parameters).find(p => p && p.in === 'body')
    return body?.schema || null
  }
}

function extractResponseBodySchema(op) {
  const responses = op.responses || {}
  const prefer = ['200', '201', 'default', ...Object.keys(responses)]
  if (isOAS3) {
    for (const code of prefer) {
      const r = responses[code]
      if (!r || !r.content) continue
      const c = r.content
      const ct = c['application/json'] ? 'application/json' : Object.keys(c)[0]
      if (ct && c[ct].schema) return c[ct].schema
    }
  } else {
    for (const code of prefer) {
      const r = responses[code]
      if (r?.schema) return r.schema
    }
  }
  return null
}

// ---------- 主流程 ----------
;(async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(SQL.ensure)

    const paths = DOC.paths || {}
    let count = 0

    for (const [p, pathItem] of Object.entries(paths)) {
      for (const m of methods) {
        if (!pathItem[m]) continue
        const op = pathItem[m]

        const name = op.summary || op.operationId || `${m.toUpperCase()} ${p}`
        const meta = {
          name,
          summary: op.summary || '',
          description: op.description || '',
          operation_id: op.operationId || '',
          tag: Array.isArray(op.tags) && op.tags.length ? op.tags[0] : ''
        }

        // upsert endpoint
        const res = await client.query(SQL.upsertEndpoint, [m.toUpperCase(), p, meta.name, meta.summary, meta.description, meta.operation_id, meta.tag])
        const apiId = res.rows[0].id

        // fields
        const fields = []

        // 1) 参数（query/path/header/cookie）
        fields.push(...collectParameters(pathItem, op))

        // 2) 请求体
        const reqSchema = extractRequestBodySchema(op)
        if (reqSchema) {
          const rows = flattenProperties(reqSchema)
          rows.forEach(r =>
            fields.push({
              io: 'request',
              location: 'body',
              field_path: r.field_path,
              level: r.level,
              type: r.type,
              required: r.required,
              description: r.description,
              possible: r.possible
            })
          )
        }

        // 3) 响应体
        const respSchema = extractResponseBodySchema(op)
        if (respSchema) {
          const rows = flattenProperties(respSchema)
          rows.forEach(r =>
            fields.push({
              io: 'response',
              location: 'body',
              field_path: r.field_path,
              level: r.level,
              type: r.type,
              required: r.required,
              description: r.description,
              possible: r.possible
            })
          )
        }

        // 覆盖写入子表
        if (CONF.truncate_fields_before_upsert !== false) {
          await client.query(SQL.deleteFields, [apiId])
        }
        for (const f of fields) {
          await client.query(SQL.insertField, [apiId, f.io, f.location, f.field_path, f.level, f.type, f.required, f.description, f.possible])
        }

        count++
        if (count % 20 === 0) console.log(`已处理 ${count} 个接口…`)
      }
    }

    await client.query('COMMIT')
    console.log(`✅ 完成：写入/更新 ${count} 个接口，已落库到 api_endpoint / api_field。`)
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('❌ 失败：', e.message || e)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
})()
