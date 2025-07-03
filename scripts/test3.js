const { Client } = require('pg') // openGauss 也兼容

const sql = `
  EXPLAIN (FORMAT JSON)
  SELECT t1.name, COUNT(*) FROM employee t1
  JOIN department t2 ON t1.dept_id = t2.id
  WHERE t1.salary > 5000
  GROUP BY t1.name
  ORDER BY COUNT(*) DESC
  LIMIT 10;
`

const client = new Client({  }) // openGauss 配置
await client.connect()
const res = await client.query(sql)

const plan = res.rows[0]['QUERY PLAN'][0]['Plan']

function collectOperators(planNode, result = []) {
  if (!planNode) return result
  result.push(planNode['Node Type'])
  if (planNode['Plans']) {
    planNode['Plans'].forEach(sub => collectOperators(sub, result))
  }
  return result
}

const operators = collectOperators(plan)
const uniqueOps = [...new Set(operators)]
console.log(`共使用了 ${operators.length} 个算子，${uniqueOps.length} 种类型：`, uniqueOps)