<template>
    <div class="graph-container">
        <!-- 工具栏 -->
        <div class="toolbar">
            <el-button size="small" @click="graph?.fitView()">适应画布</el-button>
            <el-button size="small" @click="graph?.zoom(1.1)">放大</el-button>
            <el-button size="small" @click="graph?.zoom(0.9)">缩小</el-button>
            <el-button size="small" @click="graph?.zoomTo(1)">1:1</el-button>
            <el-button size="small" @click="refreshGraph()">刷新</el-button>
        </div>

        <div ref="graphRef" class="graph-box"></div>

        <!-- 图例 -->
        <div class="legend">
            <strong>图例控制：</strong><br />
            <el-tag v-for="type in Object.keys(entityTypeColor)" :key="type"
                :type="legendType[type] ? 'success' : 'info'" @click="toggleLegend(type)"
                style="cursor: pointer; margin: 3px">
                {{ type }}
            </el-tag>
        </div>

        <el-dialog v-model="showDetail" :title="detailTitle" width="600px">
            <pre>{{ detailContent }}</pre>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import G6 from '@antv/g6'

// 基础数据
const graphRef = ref()
const showDetail = ref(false)
const detailTitle = ref('')
const detailContent = ref('')
let graph = null

// 图例控制状态
const legendType = ref({
    Table: true,
    Procedure: true,
    Interface: true,
    System: true
})

const entityTypeColor = {
    Table: '#5B8FF9',
    Procedure: '#D3C6EA',
    Interface: '#F6BD16',
    System: '#A0A0A0'
}

// 核心数据 nodes（包含 tableType: dim）
const nodes = [
    {
        id: 'table1',
        label: '用户表\n(用户信息)',
        entityType: 'Table',
        tableType: 'fact', // fact | dim
        fields: [
            { name: 'id', comment: '用户ID', length: 11 },
            { name: 'username', comment: '用户名', length: 50 }
        ],
        style: {}
    },
    {
        id: 'dim_area',
        label: '地区表\n(维表)',
        entityType: 'Table',
        tableType: 'dim', // 维度表
        fields: [
            { name: 'area_id', comment: '地区ID', length: 11 },
            { name: 'area_name', comment: '地区名称', length: 50 }
        ],
        style: {}
    },
    {
        id: 'proc1',
        label: '更新用户\n(存储过程)',
        entityType: 'Procedure',
        inputParams: ['userId', 'newName'],
        outputParams: ['status'],
        sql: 'CREATE PROCEDURE ...',
        style: {}
    },
    {
        id: 'interface1',
        label: '获取用户\n(接口)',
        entityType: 'Interface',
        inputParams: ['userId'],
        outputParams: ['userInfo'],
        sql: 'SELECT * FROM user WHERE id = ?;',
        style: {}
    },
    {
        id: 'systemA',
        label: '系统A\n(外部系统)',
        entityType: 'System',
        style: {}
    }
]

const edges = [
    { source: 'table1', target: 'proc1', label: '平台A - 存储过程', style: { stroke: '#1890ff' } },
    { source: 'dim_area', target: 'proc1', label: '平台B - SQL脚本', style: { stroke: '#52c41a' } },
    { source: 'proc1', target: 'interface1', label: '平台B - SQL脚本', style: { stroke: '#52c41a' } },
    { source: 'systemA', target: 'table1', label: 'Spark集成', style: { stroke: '#faad14' } }
]

// 切换图例
const toggleLegend = (type) => {
    legendType.value[type] = !legendType.value[type]
    refreshGraph()
}

// 图渲染逻辑
const refreshGraph = () => {
    if (!graph) return

    // 根据图例过滤数据
    const displayNodes = nodes.filter((n) => legendType.value[n.entityType])
    const displayEdges = edges.filter(
        (e) => displayNodes.find((n) => n.id === e.source) && displayNodes.find((n) => n.id === e.target)
    )

    graph.changeData({ nodes: displayNodes, edges: displayEdges })
    graph.fitView()
}

onMounted(() => {
    G6.registerNode('modal-node', {
        draw(cfg, group) {
            const color = entityTypeColor[cfg.entityType] || '#ccc'

            const keyShape = group.addShape('rect', {
                attrs: {
                    x: -80, y: -30, width: 160, height: 60,
                    fill: color, stroke: '#ccc', radius: 8
                }
            })

            // 显示标签
            const text = cfg.entityType === 'Table' && cfg.tableType === 'dim'
                ? cfg.label.split('\n')[0] // 聚合维表只展示表名
                : cfg.label

            group.addShape('text', {
                attrs: {
                    x: 0,
                    y: 0,
                    text: text,
                    fill: '#fff',
                    textAlign: 'center',
                    textBaseline: 'middle'
                }
            })

            return keyShape
        }
    })

    graph = new G6.Graph({
        container: graphRef.value,
        layout: { type: 'dagre', rankdir: 'LR', nodesep: 30, ranksep: 100 },
        defaultNode: {
            type: 'modal-node',
            size: [160, 60],
            style: { fill: '#5B8FF9', stroke: '#ccc', radius: 8 },
            labelCfg: { style: { fill: '#fff', fontSize: 12, textAlign: 'center', textBaseline: 'middle' } }
        },
        defaultEdge: {
            type: 'quadratic', // 曲线
            style: { endArrow: true, stroke: '#aaa' }
        },
        modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node'] }
    })

    refreshGraph()
    // 初始化加载完毕后自动 fitView
    graph.once('afterrender', () => {
        graph.fitView()
    })
    graph.on('node:click', (evt) => {
        const model = evt.item.getModel()
        detailTitle.value = model.label.replace('\n', ' ')
        let content = ''

        if (model.entityType === 'Table') {
            if (model.tableType === 'dim') {
                content += '维表（聚合展示）\n'
            }
            content += '【表字段】\n'
            model.fields?.forEach(f => {
                content += `- ${f.name}(${f.comment}, 长度:${f.length})\n`
            })
        } else {
            content += `输入参数：${model.inputParams?.join(', ') || '无'}\n`
            content += `输出参数：${model.outputParams?.join(', ') || '无'}\n`
            content += `SQL：\n${model.sql || '无'}`
        }

        detailContent.value = content
        showDetail.value = true
    })

    window.addEventListener('resize', () => {
        graph?.changeSize(window.innerWidth, window.innerHeight - 50)
    })
})

onBeforeUnmount(() => {
    graph?.destroy()
})
</script>

<style scoped>
.graph-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.toolbar {
    height: 40px;
    padding: 5px 10px;
    background: #f5f5f5;
    display: flex;
    gap: 10px;
    align-items: center;
}

.graph-box {
    width: 100%;
    height: calc(100vh - 40px);
}

.legend {
    position: absolute;
    top: 50px;
    right: 20px;
    background: #fff;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1.8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>