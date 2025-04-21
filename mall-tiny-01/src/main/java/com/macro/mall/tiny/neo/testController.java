package com.macro.mall.tiny.neo;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.neo4j.driver.Value;
import org.neo4j.driver.types.Node;
import org.neo4j.driver.types.Path;
import org.neo4j.driver.types.Relationship;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 通用 G6 图谱控制器（简化版）
 * 支持执行 Cypher 查询、血缘路径分析、过滤维度表等
 */
@RestController
@RequestMapping("/test")
public class testController {

    private final MetadataSyncTask syncTask;
    private final Neo4jWriter neo4jWriter;

    public testController(MetadataSyncTask syncTask, Neo4jWriter neo4jWriter) {
        this.syncTask = syncTask;
        this.neo4jWriter = neo4jWriter;
    }




/**
 * 核心入口接口：
 * 支持根据 tableId / tableName / sqlName 进行血缘路径分析
 * 支持方向：up / down / both
 * 支持封闭路径：closed = true
 * 支持过滤条件：nodeFilter（排除节点属性），relFilter（排除边属性）
 */
@PostMapping("/g6/resolve")
public Map<String, Object> resolveLineage(@RequestBody Map<String, Object> body) {
    String direction = (String) body.getOrDefault("direction", "both");
    int level = (int) body.getOrDefault("level", 2);
    boolean closed = Boolean.TRUE.equals(body.get("closed"));

    @SuppressWarnings("unchecked")
    Map<String, Object> nodeFilter = (Map<String, Object>) body.get("nodeFilter");

    @SuppressWarnings("unchecked")
    Map<String, Object> relFilter = (Map<String, Object>) body.get("relFilter");

    // 根据 tableId / tableName / sqlName 三选一解析业务 ID
    String tableId = resolveTableId(body);

    if (closed) {
        // 封闭路径（中心点为 tableId，两侧路径均返回）
        return resolveClosedLineage(tableId, level, nodeFilter, relFilter);
    } else {
        // 普通方向路径（向上/向下/双向）
        return resolveDirectionalLineage(tableId, direction, level, nodeFilter, relFilter);
    }
}

/**
 * 通用路径查询（非封闭）
 */
private Map<String, Object> resolveDirectionalLineage(String tableId, String direction, int level,
                                                      Map<String, Object> nodeFilter,
                                                      Map<String, Object> relFilter) {
    String arrow;
    if ("up".equals(direction)) {
        arrow = "<-[r:LINEAGE_TO*1.." + level + "]-";
    } else if ("down".equals(direction)) {
        arrow = "-[r:LINEAGE_TO*1.." + level + "]->";
    } else {
        arrow = "-[r:LINEAGE_TO*1.." + level + "]-";
    }

    String whereClause = buildWhereClause(nodeFilter, relFilter, "n", "r");
    String cypher = "MATCH p=(n:Table {id: $tableId})" + arrow + "(m:Table) " + whereClause + " RETURN p";

    Map<String, Object> params = Collections.singletonMap("tableId", tableId);
    return buildG6FromCypher(cypher, params, tableId, nodeFilter, relFilter);
}

/**
 * 封闭路径查询：以 tableId 为中心点，向上和向下分别查找路径
 */
private Map<String, Object> resolveClosedLineage(String tableId, int level,
                                                 Map<String, Object> nodeFilter,
                                                 Map<String, Object> relFilter) {
    List<Map<String, Object>> allPaths = new ArrayList<>();

    String whereUp = buildWhereClause(nodeFilter, relFilter, "a", "r");
    String whereDown = buildWhereClause(nodeFilter, relFilter, "b", "r");

    String cypherUp = "MATCH p=(a:Table)-[r:LINEAGE_TO*1.." + level + "]->(mid:Table {id: $tableId}) " + whereUp + " RETURN p";
    String cypherDown = "MATCH p=(mid:Table {id: $tableId})-[r:LINEAGE_TO*1.." + level + "]->(b:Table) " + whereDown + " RETURN p";

    Map<String, Object> param = Collections.singletonMap("tableId", tableId);

    allPaths.addAll(neo4jWriter.query(cypherUp, param));
    allPaths.addAll(neo4jWriter.query(cypherDown, param));

    Map<String, Object> result = buildG6FromPathList(allPaths);
    result.put("cypher", cypherUp + "\n" + cypherDown);
    result.put("params", param);
    result.put("startId", tableId);

    Map<String, Object> summary = new HashMap<>();
    if (nodeFilter != null && !nodeFilter.isEmpty()) summary.put("nodeFilter", nodeFilter);
    if (relFilter != null && !relFilter.isEmpty()) summary.put("relFilter", relFilter);
    result.put("filterSummary", summary);

    return result;
}
/**
 * 构造 WHERE 子句，根据 nodeFilter 和 relFilter 的排除逻辑
 * 示例输出：WHERE NOT n.layer IN ['dwd'] AND ALL(x IN r WHERE NOT x.sqlName IN ['xxx'])
 */
private String buildWhereClause(Map<String, Object> nodeFilter, Map<String, Object> relFilter,
                                String nodeAlias, String relAlias) {
    List<String> clauses = new ArrayList<>();

    if (nodeFilter != null) {
        for (Map.Entry<String, Object> entry : nodeFilter.entrySet()) {
            List<?> values = (List<?>) entry.getValue();
            if (values != null && !values.isEmpty()) {
                clauses.add("NOT " + nodeAlias + "." + entry.getKey() + " IN " + toCypherList(values));
            }
        }
    }

    if (relFilter != null) {
        for (Map.Entry<String, Object> entry : relFilter.entrySet()) {
            List<?> values = (List<?>) entry.getValue();
            if (values != null && !values.isEmpty()) {
                clauses.add("ALL(x IN " + relAlias + " WHERE NOT x." + entry.getKey() + " IN " + toCypherList(values) + ")");
            }
        }
    }

    return clauses.isEmpty() ? "" : "WHERE " + String.join(" AND ", clauses);
}

private String toCypherList(List<?> list) {
    StringBuilder sb = new StringBuilder("[");
    Iterator<?> iterator = list.iterator();
    while (iterator.hasNext()) {
        sb.append("'").append(iterator.next()).append("'");
        if (iterator.hasNext()) sb.append(", ");
    }
    sb.append("]");
    return sb.toString();
}

/**
 * 执行任意路径查询 Cypher 并返回 G6 格式结构（nodes + edges）
 */
private Map<String, Object> buildG6FromCypher(String cypher, Map<String, Object> params,
                                              String startId,
                                              Map<String, Object> nodeFilter,
                                              Map<String, Object> relFilter) {
    List<Map<String, Object>> raw = neo4jWriter.query(cypher, params);
    Map<String, Object> result = buildG6FromPathList(raw);
    result.put("cypher", cypher);
    result.put("params", params);
    result.put("startId", startId);

    Map<String, Object> summary = new HashMap<>();
    if (nodeFilter != null && !nodeFilter.isEmpty()) summary.put("nodeFilter", nodeFilter);
    if (relFilter != null && !relFilter.isEmpty()) summary.put("relFilter", relFilter);
    result.put("filterSummary", summary);

    return result;
}

/**
 * 将 Neo4j 路径查询结果统一转为 G6 格式（id/label/source/target）
 */
private Map<String, Object> buildG6FromPathList(List<Map<String, Object>> raw) {
    List<Map<String, Object>> nodes = new ArrayList<>();
    List<Map<String, Object>> edges = new ArrayList<>();
    Set<String> nodeIds = new HashSet<>();
    Map<Long, String> nodeIdToBusinessId = new HashMap<>();

    for (Map<String, Object> map : raw) {
        for (Object val : map.values()) {
            if (val instanceof Path) {
                Path path = (Path) val;
                for (Node node : path.nodes()) {
                    String id = node.get("id").asString();
                    if (nodeIds.add(id)) {
                        Map<String, Object> nodeMap = new HashMap<>(node.asMap());
                        nodeMap.put("id", id);
                        nodeMap.put("label", node.get("name").asString());

                        String label = node.labels().iterator().next();
                        nodeMap.put("type", label);         // 保留原 label 作为类型
                        nodeMap.put("nodeType", normalizeNodeType(label)); // 新增字段，前端 legend 分类用


                        Value fieldsValue = node.get("fields");
                        System.out.println("字段类型: " + fieldsValue.type().name());
                        if (fieldsValue != null && !fieldsValue.isNull()) {
//                            if (fieldsValue.type().name().equals("LIST")) {
//                                nodeMap.put("fields", fieldsValue.asList());
//                            } else {
//                                String fieldsStr = fieldsValue.asString();
//                                // 尝试将字符串解析为 JSON 数组
//                                try {
//                                    List<String> fieldsList = JSON.parseArray(fieldsStr, String.class);
//                                    nodeMap.put("fields", fieldsList);
//                                } catch (Exception e) {
//                                    // 解析失败，保留原始字符串或设为空列表
//                                    System.out.println("字段解析失败: " + fieldsStr);
//                                    nodeMap.put("fields", Collections.emptyList());
//                                }
//                            }
                            nodeMap.put("fields",fieldsValue.asString() );
                        } else {
//                            nodeMap.put("fields", "");
                        }

                        nodes.add(nodeMap);
                        nodeIdToBusinessId.put(node.id(), id);
                    }
                }
                for (Relationship rel : path.relationships()) {
                    Map<String, Object> edge = new HashMap<>(rel.asMap());
                    edge.put("source", nodeIdToBusinessId.getOrDefault(rel.startNodeId(), String.valueOf(rel.startNodeId())));
                    edge.put("target", nodeIdToBusinessId.getOrDefault(rel.endNodeId(), String.valueOf(rel.endNodeId())));
                    edge.put("label", rel.type());
                    edges.add(edge);
                }
            }
        }
    }

    Map<String, Object> result = new HashMap<>();
    result.put("nodes", nodes);
    result.put("edges", edges);
    return result;
}

/**
 * 根据 tableId / tableName / sqlName 三选一获取业务主键 ID
 */
private String resolveTableId(Map<String, Object> body) {
    if (body.containsKey("tableId")) return body.get("tableId").toString();

    if (body.containsKey("tableName")) {
        List<Map<String, Object>> result = neo4jWriter.query(
                "MATCH (t:Table) WHERE t.name = $name RETURN t.id AS id",
                Collections.singletonMap("name", body.get("tableName")));
        if (!result.isEmpty()) return result.get(0).get("id").toString();
    }

    if (body.containsKey("sqlName")) {
        List<Map<String, Object>> result = neo4jWriter.query(
                "MATCH (a:Table)-[r:LINEAGE_TO {sqlName: $sqlName}]->(b:Table) RETURN b.id AS id",
                Collections.singletonMap("sqlName", body.get("sqlName")));
        if (!result.isEmpty()) return result.get(0).get("id").toString();
    }

    throw new IllegalArgumentException("无法解析 tableId，请传入 tableId / tableName / sqlName 中至少一个");
}

private String normalizeNodeType(String label) {
    if (label == null) return "other";
    switch (label.toLowerCase()) {
        case "table": return "table";
        case "procedure": return "procedure";
        case "view": return "view";
        case "api": return "api";
        case "system": return "system";
        default: return "other";
    }
}
}