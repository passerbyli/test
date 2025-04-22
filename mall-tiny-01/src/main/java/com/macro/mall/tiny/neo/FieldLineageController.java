package com.macro.mall.tiny.neo;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.schema.Table;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.Statements;
import net.sf.jsqlparser.statement.insert.Insert;
import net.sf.jsqlparser.statement.select.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lineage")
public class FieldLineageController {

    public static class LineageNode {
        public String id;
        public String label;
        public String type = "Field";
    }

    public static class LineageEdge {
        public String source;
        public String target;
        public String label = "FIELD_LINEAGE";
    }

    public static class LineageGraph {
        public List<LineageNode> nodes = new ArrayList<LineageNode>();
        public List<LineageEdge> edges = new ArrayList<LineageEdge>();
    }

    private Map<String, List<LineageEdge>> cteFieldMap = new HashMap<String, List<LineageEdge>>();

    @PostMapping("/g6")
    public LineageGraph extractLineage(@RequestBody Map<String, String> request) throws Exception {
        String sql = request.get("sql");

        Set<String> nodeSet = new HashSet<String>();
        List<LineageEdge> edges = new ArrayList<LineageEdge>();

        List<String> statementsToParse = extractStatements(sql);
        for (String stmt : statementsToParse) {
            Statements statements = CCJSqlParserUtil.parseStatements(stmt);
            for (Statement s : statements.getStatements()) {
                if (s instanceof Insert) {
                    Insert insert = (Insert) s;
                    String targetTable = insert.getTable().getFullyQualifiedName();
                    List<String> targetColumns = insert.getColumns() != null
                            ? insert.getColumns().stream().map(c -> c.getColumnName()).collect(Collectors.toList())
                            : new ArrayList<String>();

                    if (insert.getSelect() != null) {
                        SelectBody selectBody = insert.getSelect().getSelectBody();
                        Map<String, String> aliasToTable = new HashMap<String, String>();
                        processSelectBody(selectBody, aliasToTable, edges, targetTable, targetColumns);
                    }
                }
            }
        }

        LineageGraph graph = new LineageGraph();
        for (LineageEdge edge : edges) {
            if (nodeSet.add(edge.source)) {
                LineageNode src = new LineageNode();
                src.id = edge.source;
                src.label = edge.source;
                graph.nodes.add(src);
            }
            if (nodeSet.add(edge.target)) {
                LineageNode tgt = new LineageNode();
                tgt.id = edge.target;
                tgt.label = edge.target;
                graph.nodes.add(tgt);
            }
            graph.edges.add(edge);
        }
        return graph;
    }

    private void processSelectBody(SelectBody selectBody,
                                   Map<String, String> aliasToTable,
                                   List<LineageEdge> edges,
                                   String targetTable,
                                   List<String> targetColumns) {
        if (selectBody instanceof WithItem) {
            WithItem withItem = (WithItem) selectBody;
            String cteName = withItem.getName().getValue();
            String cteTable = "cte." + cteName;
            aliasToTable.put(cteName, cteTable);

            List<LineageEdge> cteEdges = new ArrayList<LineageEdge>();
            processSelectBody(withItem.getSelectBody(), aliasToTable, cteEdges, cteTable, null);
            cteFieldMap.put(cteTable, cteEdges);
        } else if (selectBody instanceof PlainSelect) {
            PlainSelect plain = (PlainSelect) selectBody;
            registerFromItem(plain.getFromItem(), aliasToTable);
            if (plain.getJoins() != null) {
                for (Join join : plain.getJoins()) {
                    registerFromItem(join.getRightItem(), aliasToTable);
                }
            }
            List<SelectItem> selectItems = plain.getSelectItems();
            for (int i = 0; i < selectItems.size(); i++) {
                String src = extractSourceField(selectItems.get(i), aliasToTable);
                String tgt = (targetColumns != null && targetColumns.size() > i)
                        ? targetTable + "." + targetColumns.get(i)
                        : targetTable + ".col_" + i;

                if (src.startsWith("cte.")) {
                    List<LineageEdge> subEdges = cteFieldMap.getOrDefault(src, new ArrayList<LineageEdge>());
                    for (final LineageEdge subEdge : subEdges) {
                        LineageEdge edge = new LineageEdge();
                        edge.source = subEdge.source;
                        edge.target = tgt;
                        edges.add(edge);
                    }
                } else {
                    LineageEdge edge = new LineageEdge();
                    edge.source = src;
                    edge.target = tgt;
                    edges.add(edge);
                }
            }
        } else if (selectBody instanceof SetOperationList) {
            SetOperationList setList = (SetOperationList) selectBody;
            for (SelectBody sb : setList.getSelects()) {
                processSelectBody(sb, aliasToTable, edges, targetTable, targetColumns);
            }
        }
    }

    private void registerFromItem(FromItem fromItem, Map<String, String> aliasMap) {
        if (fromItem.getAlias() != null) {
            aliasMap.put(fromItem.getAlias().getName(), fromItem.toString());
        } else if (fromItem instanceof Table) {
            Table table = (Table) fromItem;
            aliasMap.put(table.getName(), table.getFullyQualifiedName());
        }
    }

    private String extractSourceField(SelectItem item, Map<String, String> aliasToTable) {
        if (item instanceof SelectExpressionItem) {
            SelectExpressionItem sei = (SelectExpressionItem) item;
            String expr = sei.getExpression().toString();
            if (expr.contains(".")) {
                String[] parts = expr.split("\\.");
                String alias = parts[0];
                String column = parts[1];
                String table = aliasToTable.getOrDefault(alias, alias);
                return table + "." + column;
            } else {
                return "unknown." + expr;
            }
        }
        return "unknown.unknown";
    }

    private List<String> extractStatements(String sql) {
        List<String> stmts = new ArrayList<String>();
        Matcher m = Pattern.compile("BEGIN(.*?)END;", Pattern.CASE_INSENSITIVE | Pattern.DOTALL).matcher(sql);
        while (m.find()) {
            String body = m.group(1).replaceAll("--.*", "").trim();
            String[] parts = body.split(";");
            for (String p : parts) {
                if (p.trim().toLowerCase().startsWith("insert") || p.trim().toLowerCase().startsWith("with")) {
                    stmts.add(p.trim().endsWith(";") ? p.trim() : p.trim() + ";");
                }
            }
        }
        return stmts;
    }
}