删除所有数据

```
MATCH (n)
DETACH DELETE n
```

查找所有下游（不限定关系类型）
• [*] ：表示任意长度的路径
• -> ：表示单向（只查下游）
• 如果是无向关系可以用 -[]-
• 起点可以根据条件查找，比如按 name：

```
MATCH (startNode:Table {name: 'dm.ods_orders'})
MATCH path = (startNode)-[*]->(downstream)
RETURN path
```

向上查找所有上游节点（不限制路径长度）

```
MATCH (target:dl_Table {name: 'dm_api_01'})
MATCH path = (upstream)-[*]->(target)
RETURN path
```

# new

### 根据表名dm.table_ads_1开始双向溯源，限制5跳

```
MATCH path = (start:Table {id: 'dm.table_ads_1'})-[*1..5]-(other:Table)
RETURN path
```

### 以dm.table_ads_1为起点，向下2跳

```
MATCH p=(a:Table {id: 'dm.table_ads_1'})-[r:LINEAGE_TO*1..2]->(b:Table)
RETURN a, b, r
```

### 以dm.table_ads_1为起点，向上2跳

从 a → ... → b 的路径中，b 是你目标表 dm.table_ads_1，即“向上”查找它的来源表。

```
MATCH p=(a:Table)-[r:LINEAGE_TO*1..2]->(b:Table)
WHERE b.id = 'dm.table_ads_1'
RETURN a, b, r
```
