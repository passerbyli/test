function extractTables(sqlScript) {
  const regex = /\b([A-Za-z0-9_-]+)\sAS\s\(/g; // 修改为支持中横线的表名
  const tableNames = [];
  let match;

  // 使用 exec 循环查找所有符合条件的表名
  while ((match = regex.exec(sqlScript)) !== null) {
    tableNames.push(match[1]); // match[1] 是捕获的表名
  }

  return tableNames;
}

const sqlScript = `
WITH aaa-table AS (
    SELECT user_id, COUNT(*) AS order_count 
    FROM tmp_raw_orders 
    GROUP BY user_id
), bbb_table AS (
    SELECT DISTINCT ON (user_id) user_id, order_time AS last_order 
    FROM tmp_raw_orders 
    ORDER BY user_id, order_time DESC
), ccc_table AS (
    SELECT user_id, SUM(amount) AS total_amount
    FROM tmp_raw_orders
    GROUP BY user_id
)
-- 阶段3：写入目标Schema的物理表
INSERT INTO ct_cms.user_orders_wide
SELECT u.user_id, u.username, s.order_count, s.total_amount, l.last_order
FROM ct_cms.users u
LEFT JOIN aaa-table s USING (user_id)
LEFT JOIN bbb_table l USING (user_id)
LEFT JOIN ccc_table t USING (user_id)
WHERE u.created_at <= target_date;
`;

const tempTables = extractTables(sqlScript);

console.log(tempTables); // 输出临时表名：['aaa-table', 'bbb_table', 'ccc_table']
