<template>
    <div class="graph-container">
        <!-- 工具栏 -->
        <div class="toolbar">
            <el-button size="small" @click="graph?.fitView()">适应画布</el-button>
            <el-button size="small" @click="graph?.zoom(1.1)">放大</el-button>
            <el-button size="small" @click="graph?.zoom(0.9)">缩小</el-button>
            <el-button size="small" @click="graph?.zoomTo(1)">1:1</el-button>
            <el-button size="small" @click="graph?.refresh()">刷新</el-button>
        </div>

        <!-- 血缘图 -->
        <div ref="graphRef" class="graph-box"></div>

        <!-- 图例 -->
        <div class="legend">
            <strong>图例：</strong><br />
            <span style="color:#1890ff;">●</span> 存储过程（平台A）<br />
            <span style="color:#52c41a;">●</span> SQL脚本（平台B）<br />
            <span style="color:#faad14;">●</span> Spark集成<br />
            <hr />
            <strong>实体类型：</strong><br />
            <span style="color:#5b8ff9;">■</span> 表<br />
            <span style="color:#f6bd16;">■</span> 接口<br />
            <span style="color:#d3c6ea;">■</span> 存储过程<br />
            <span style="color:#a0a0a0;">■</span> 外部系统
        </div>

        <!-- 详情弹窗 -->
        <el-dialog v-model="showDetail" :title="detailTitle" width="600px">
            <pre>{{ detailContent }}</pre>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import G6 from '@antv/g6'

const graphRef = ref()
const showDetail = ref(false)
const detailTitle = ref('')
const detailContent = ref('')
let graph = null

const entityTypeColor = {
    Table: '#5B8FF9',
    Interface: '#F6BD16',
    Procedure: '#D3C6EA',
    System: '#A0A0A0'
}

const nodes = [
    {
        id: 'table1',
        label: '用户表\n(用户信息)',
        entityType: 'Table',
        fields: [
            { name: 'id', comment: '用户ID', length: 11 },
            { name: 'username', comment: '用户名', length: 50 }
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
    { source: 'proc1', target: 'interface1', label: '平台B - SQL脚本', style: { stroke: '#52c41a' } },
    { source: 'systemA', target: 'table1', label: 'Spark集成', style: { stroke: '#faad14' } }
]

onMounted(() => {
    G6.registerNode('modal-node', {
        draw(cfg, group) {
            const color = entityTypeColor[cfg.entityType] || '#ccc'

            const keyShape = group.addShape('rect', {
                attrs: {
                    x: -80,
                    y: -30,
                    width: 160,
                    height: 60,
                    fill: color,
                    stroke: '#ccc',
                    radius: 8
                }
            })

            group.addShape('text', {
                attrs: {
                    x: 0,
                    y: 0,
                    text: cfg.label,
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
            type: 'line',
            style: { endArrow: true, stroke: '#aaa' }
        },
        modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node'] }
    })
    console.log('nodes', nodes)
    console.log('edges', edges)
    graph.data({ nodes, edges })
    graph.render()

    graph.on('node:click', (evt) => {
        const model = evt.item.getModel()
        detailTitle.value = model.label.replace('\n', ' ')
        let content = ''
        if (model.entityType === 'Table') {
            content += '【表字段】\n'
            model.fields.forEach(f => {
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

    graph.on('edge:click', (evt) => {
        const edgeModel = evt.item.getModel()
        detailTitle.value = `${edgeModel.source} → ${edgeModel.target}`
        detailContent.value = edgeModel.label || '无详细信息'
        showDetail.value = true
    })

    window.addEventListener('resize', () => {
        graph.changeSize(window.innerWidth, window.innerHeight - 50)
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