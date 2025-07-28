const { Pool } = require("pg");
const BaseAdapter = require("./baseAdapter");
const { convertRowToCamelCase } = require("./utils/format");

class PostgresAdapter extends BaseAdapter {
  async connect() {
    if (!this.pool) {
      this.pool = new Pool(this.config);
    }
  }

  prepare(sql, params = {}) {
    const values = [];
    let index = 1;
    const transformedSql = sql.replace(/:([a-zA-Z_][\w]*)/g, (_, key) => {
      if (!(key in params)) throw new Error(`缺少参数: ${key}`);
      const val = params[key];
      if (Array.isArray(val)) {
        const placeholders = val.map(() => `$${index++}`);
        values.push(...val);
        return `(${placeholders.join(",")})`;
      } else {
        values.push(val);
        return `$${index++}`;
      }
    });
    this.log("sql", `执行SQL: ${transformedSql} [${values.join(", ")}]`);
    return { sql: transformedSql, values };
  }

  async query(sql, params = {}) {
    await this.connect();
    const { sql: finalSql, values } = this.prepare(sql, params);
    const res = await this.pool.query(finalSql, values);
    return this.camelCase ? res.rows.map(convertRowToCamelCase) : res.rows;
  }

  async queryByPage(sql, params = {}, { page = 1, pageSize = 20 } = {}) {
    await this.connect();
    const { sql: preparedSql, values } = this.prepare(sql, params);

    const countSql = `SELECT COUNT(*) as total FROM (${preparedSql}) AS temp`;
    const countRes = await this.pool.query(countSql, values);
    const total = parseInt(countRes.rows[0].total, 10);

    const offset = (page - 1) * pageSize;
    const pagedSql = `${preparedSql} LIMIT $${values.length + 1} OFFSET $${
      values.length + 2
    }`;
    const res = await this.pool.query(pagedSql, [...values, pageSize, offset]);
    const resultRows = this.camelCase
      ? res.rows.map(convertRowToCamelCase)
      : res.rows;

    return { total, page, pageSize, rows: resultRows };
  }

  async update(sql, params = {}) {
    return this.execute(sql, params);
  }

  async delete(sql, params = {}) {
    return this.execute(sql, params);
  }

  async execute(sql, params = {}) {
    await this.connect();
    const { sql: finalSql, values } = this.prepare(sql, params);
    const res = await this.pool.query(finalSql, values);
    return res;
  }

  close() {
    this.pool?.end();
  }
}

module.exports = PostgresAdapter;
