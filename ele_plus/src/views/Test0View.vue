<template>
    <div class="graph-wrapper">
        <div id="container" class="graph-container"></div>
        <div class="legend">
            <div><span class="legend-icon table"></span> 表</div>
            <div><span class="legend-icon api"></span> 接口</div>
        </div>

        <el-dialog v-model="dialogVisible" title="字段信息" width="500px">
            <el-table :data="selectedNodeFields" border stripe>
                <el-table-column prop="name" label="字段名" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="length" label="长度" />
                <el-table-column prop="primaryKey" label="主键" />
            </el-table>
        </el-dialog>

        <el-dialog v-model="edgeDialogVisible" title="关系信息" width="400px">
            <el-descriptions :column="1" border>
                <el-descriptions-item label="存储过程">{{ selectedEdgeInfo.procedure }}</el-descriptions-item>
                <el-descriptions-item label="执行周期">{{ selectedEdgeInfo.schedule }}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue'
import G6 from '@antv/g6'

const dialogVisible = ref(false)
const edgeDialogVisible = ref(false)
const selectedNodeFields = ref([])
const selectedEdgeInfo = ref({})

const graphData = {
    nodes: [
        {
            id: 'ods_user',
            label: 'ODS原始用户表',
            alias: 'ODS原始用户表',
            schema: 'ods',
            fields: [
                {
                    name: 'user_id', type: 'varchar', length: 32, primaryKey: true
                },
                {
                    name: 'user_name', type: 'varchar', length: 128, primaryKey: false
                }
            ]
        },
        {
            id: 'dwd_user_info',
            label: 'DWD用户信息宽表',
            alias: 'DWD用户信息宽表',
            comboId: 'dwd',
            schema: 'dwd',
            fields: [
                {
                    name: 'user_id', type: 'varchar', length: 32, primaryKey: true
                },
                {
                    name: 'gender', type: 'varchar', length: 2, primaryKey: false
                }
            ]
        },
        {
            id: 'dwd_user_info2',
            label: 'DWD用户信息宽表2',
            alias: 'DWD用户信息宽表2',
            comboId: 'dwd',
            schema: 'dwd',
            fields: [
                {
                    name: 'user_id', type: 'varchar', length: 32, primaryKey: true
                },
                {
                    name: 'gender', type: 'varchar', length: 2, primaryKey: false
                }
            ]
        },
        {
            id: 'dws_user_summary',
            label: 'DWS用户汇总表',
            alias: 'DWS用户汇总表',
            comboId: 'dws',
            schema: 'dws',
            fields: [
                {
                    name: 'user_id', type: 'varchar', length: 32, primaryKey: true
                },
                {
                    name: 'total_orders', type: 'int', length: 4, primaryKey: false
                }
            ]
        },
        {
            id: 'ads_user_behavior',
            label: 'ADS用户行为表',
            alias: 'ADS用户行为表',
            schema: 'ads',
            fields: [
                {
                    name: 'user_id', type: 'varchar', length: 32, primaryKey: true
                },
                {
                    name: 'summary_score', type: 'float', length: 8, primaryKey: false
                }
            ]
        }
    ],
    edges: [
        {
            source: 'ods_user', target: 'dwd_user_info', label: 'proc_etl_user_clean', schedule: '0 2 * * *'
        },
        {
            source: 'dwd_user_info', target: 'dws_user_summary', label: 'proc_user_summary', schedule: '0 3 * * *'
        },
        {
            source: 'dws_user_summary', target: 'ads_user_behavior', label: 'proc_user_behavior_export', schedule: '0 4 * * *'
        }
    ]
}

let graph = null

onMounted(() => {
    nextTick(() => {
        const container = document.getElementById('container')

        const renderGraph = () => {
            const width = container.clientWidth
            const height = container.clientHeight

            console.log(width, height)
            if (graph) graph.destroy()
            G6.registerNode('custom-node', {
                draw(cfg, group) {
                    const rect = group.addShape('rect', {
                        attrs: {
                            x: -110,
                            y: -30,
                            width: 220,
                            height: 60,
                            stroke: '#2B6CF6',
                            radius: 8,
                            fill: '#F0F5FF'
                        },
                        name: 'rect-shape'
                    })

                    group.addShape('text', {
                        attrs: {
                            text: cfg.label,
                            x: 0,
                            y: 0,
                            fill: '#000',
                            fontSize: 12,
                            textAlign: 'center',
                            textBaseline: 'middle'
                        },
                        name: 'text-shape'
                    })

                    group.addShape('image', {
                        attrs: {
                            img: 'https://img.icons8.com/ios/50/000000/view-details.png',
                            x: 80,
                            y: -25,
                            width: 16,
                            height: 16
                        },
                        name: 'icon-img'
                    })

                    return rect
                }
            }, 'rect')

            graph = new G6.Graph({
                container: 'container',
                width,
                height,
                pixelRatio: 1,
                layout: { type: 'dagre', rankdir: 'LR', nodesep: 0, ranksep: 80, sortByCombo: true },
                combos: [
                    { id: 'ods', label: 'ODS 层' },
                    { id: 'dwd', label: 'DWD 层' },
                    { id: 'dws', label: 'DWS 层' },
                    { id: 'ads', label: 'ADS 层' }
                ],
                modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'collapse-expand'] },
                defaultNode: {
                    type: 'custom-node'
                },
                defaultEdge: {
                    type: 'cubic-horizontal',
                    style: { stroke: '#888', endArrow: true },
                    labelCfg: { autoRotate: true, style: { fontSize: 10, fill: '#555' } }
                }
            })

            graph.on('node:click', (evt) => {
                const { item, target } = evt
                if (target.get('name') === 'icon-img') {
                    const model = item.getModel()
                    selectedNodeFields.value = model.fields || []
                    dialogVisible.value = true
                }
            })

            graph.on('edge:click', (evt) => {
                const model = evt.item.getModel()
                selectedEdgeInfo.value = {
                    procedure: model.label,
                    schedule: model.schedule
                }
                edgeDialogVisible.value = true
            })

            graph.data(graphData)
            graph.render()
            graph.fitView()
        }

        renderGraph()

        window.addEventListener('resize', renderGraph)
    })
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', () => { })
})
</script>

<style>
.graph-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}

.graph-container {
    border: 1px solid #f00;
    width: 100%;
    height: 100%;
}

.legend {
    position: absolute;
    right: 20px;
    top: 20px;
    background: #fff;
    padding: 10px;
    border: 1px solid #eee;
}

.legend-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
}

.legend-icon.table {
    background: #2B6CF6;
}

.legend-icon.api {
    background: #F6C12B;
}
</style>
