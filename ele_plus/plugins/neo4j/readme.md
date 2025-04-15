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
