解析 sql 脚本。如果是存储过程或函数，需要拿到存储过程/函数的名称及 schema，还有涉及哪些表，表需要区分来源表，目标表，表属于哪个 schema，是否为临时表。把结果以 json 格式输出。临时表一般不涉及 schema。
解析过程：

1. 先查找所有临时表
   create temp table xxx
   with xxx as（），yyy as，with 后面可以有多个临时表。
   select into
2. 再匹配 from，join 后面跟着的是表名，表名可能是临时表。结合前面查找的临时表，判断表是否为临时表。from 后面的表都是源表。
3. 还要考虑 merge into USING 的情况。
4. insert into 后面跟着的是目标表。
   update 后面跟着的是目标表。
   delete from 后面跟着的是目标表。
   存过脚本示例

```
CREATE OR REPLACE PROCEDURE ct_cms.etl_user_orders(target_date DATE)
LANGUAGE plpgsql AS $$
BEGIN
    -- 阶段1：在临时Schema中创建临时表
    CREATE TEMP TABLE tmp_raw_orders ON COMMIT DROP AS
    SELECT
        o.order_id,
        u.user_id,
        o.amount::NUMERIC(12,2) AS amount,
        o.order_time
    FROM ct_cms.orders o  -- 源表带Schema‌:ml-citation{ref="6" data="citationList"}
    JOIN ct_cms.users u USING (user_id)
    WHERE o.order_date = target_date;

    -- 阶段2：使用多层WITH处理
    WITH user_stats AS (
        SELECT
            user_id,
            COUNT(*) AS order_count,
            SUM(amount) AS total_amount
        FROM tmp_raw_orders
        GROUP BY user_id
    ),
    latest_orders AS (
        SELECT DISTINCT ON (user_id)
            user_id,
            order_time AS last_order
        FROM tmp_raw_orders
        ORDER BY user_id, order_time DESC
    )
    -- 阶段3：写入目标Schema的物理表
    INSERT INTO ct_cms.user_orders_wide
    SELECT
        u.user_id,
        u.username,
        s.order_count,
        s.total_amount,
        l.last_order
    FROM ct_cms.users u  -- 显式指定源Schema‌:ml-citation{ref="3" data="citationList"}
    LEFT JOIN user_stats s USING (user_id)
    LEFT JOIN latest_orders l USING (user_id)
    WHERE u.created_at <= target_date;

    -- 清理临时表（ON COMMIT DROP自动处理）
EXCEPTION WHEN others THEN
    RAISE NOTICE 'ETL失败: %', SQLERRM;
    ROLLBACK;
END;
$$;

```

解析后得到的结果：

```
[
    {
        "filePath": "xy/data/etl_user_orders.sql",
        "scriptIndex": 1,
        "type": "PROCEDURE",
        "schema": "ct_cms",
        "name": "etl_user_orders",
        "sourceTables": [
            {
                "schema": "",
                "table": "tmp_raw_orders",
                "isTemporary": true
            },
            {
                "schema": "",
                "table": "user_stats",
                "isTemporary": true
            },
            {
                "schema": "",
                "table": "latest_orders",
                "isTemporary": true
            },
            {
                "schema": "ct_cms",
                "table": "orders",
                "isTemporary": false
            },
            {
                "schema": "ct_cms",
                "table": "users",
                "isTemporary": false
            }
        ],
        "targetTables": [
            {
                "schema": "ct_cms",
                "table": "user_orders_wide",
                "isTemporary": false
            }
        ]
    }
]
```
