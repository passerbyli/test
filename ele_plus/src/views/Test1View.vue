<template>
    <div class="graph-wrapper">
        <div id="container" class="graph-container"></div>
        <div class="legend">
            <div @click="toggleNode('table')"><span class="legend-icon table"></span> 表</div>
            <div @click="toggleNode('api')"><span class="legend-icon api"></span> 接口</div>
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
    "nodes": [
        {
            "id": "ods_table1",
            "label": "ods_table1",
            "alias": "ODS层表1",
            "schema": "ods",
            "comboId": "ods",
            "type": "table",
            "fields": [
                {
                    "name": "id",
                    "type": "varchar",
                    "length": 32,
                    "primaryKey": true
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "length": 128,
                    "primaryKey": false
                }
            ]
        },
        {
            "id": "ods_table2",
            "label": "ods_table2",
            "alias": "ODS层表2",
            "schema": "ods",
            "comboId": "ods",
            "type": "table",
            "fields": [
                {
                    "name": "id",
                    "type": "varchar",
                    "length": 32,
                    "primaryKey": true
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "length": 128,
                    "primaryKey": false
                }
            ]
        },
        {
            "id": "dwd_table1",
            "label": "dwd_table1",
            "alias": "DWD层表1",
            "schema": "dwd",
            "comboId": "dwd",
            "type": "table",
            "fields": [
                {
                    "name": "id",
                    "type": "varchar",
                    "length": 32,
                    "primaryKey": true
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "length": 128,
                    "primaryKey": false
                }
            ]
        },
        {
            "id": "dwd_table2",
            "label": "dwd_table2",
            "alias": "DWD层表2",
            "schema": "dwd",
            "comboId": "dwd",
            "type": "table",
            "fields": [
                {
                    "name": "id",
                    "type": "varchar",
                    "length": 32,
                    "primaryKey": true
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "length": 128,
                    "primaryKey": false
                }
            ]
        },
        {
            "id": "dws_table1",
            "label": "dws_table1",
            "alias": "DWS层表1",
            "schema": "dws",
            "comboId": "dws",
            "type": "table",
            "fields": [
                {
                    "name": "id",
                    "type": "varchar",
                    "length": 32,
                    "primaryKey": true
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "length": 128,
                    "primaryKey": false
                }
            ]
        },
        {
            "id": "dws_table2",
            "label": "dws_table2",
            "alias": "DWS层表2",
            "schema": "dws",
            "comboId": "dws",
            "type": "table",
            "fields": [
                {
                    "name": "id",
                    "type": "varchar",
                    "length": 32,
                    "primaryKey": true
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "length": 128,
                    "primaryKey": false
                }
            ]
        },
        {
            "id": "ads_table1",
            "label": "ads_table1",
            "alias": "ADS层表1",
            "schema": "ads",
            "comboId": "ads",
            "type": "table",
            "fields": [
                {
                    "name": "id",
                    "type": "varchar",
                    "length": 32,
                    "primaryKey": true
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "length": 128,
                    "primaryKey": false
                }
            ]
        },
        {
            "id": "ads_table2",
            "label": "ads_table2",
            "alias": "ADS层表2",
            "schema": "ads",
            "comboId": "ads",
            "type": "table",
            "fields": [
                {
                    "name": "id",
                    "type": "varchar",
                    "length": 32,
                    "primaryKey": true
                },
                {
                    "name": "name",
                    "type": "varchar",
                    "length": 128,
                    "primaryKey": false
                }
            ]
        },
        {
            "id": "api_get_ads_table2",
            "label": "api_get_ads_table2",
            "alias": "查询接口",
            "comboId": "ads",
            "type": "api",
            "inputParams": [
                "id"
            ],
            "outputParams": [
                "id",
                "name"
            ]
        }
    ],
    "edges": [
        {
            "source": "api_get_ads_table2",
            "target": "ads_table2",
            "label": "QUERY"
        },
        {
            "source": "ods_table1",
            "target": "dwd_table1",
            "label": "proc_ods_table1_to_dwd_table1",
            "schedule": "0 2 * * *"
        },
        {
            "source": "ods_table1.id",
            "target": "dwd_table1.id",
            "label": ""
        },
        {
            "source": "ods_table2",
            "target": "dwd_table2",
            "label": "proc_ods_table2_to_dwd_table2",
            "schedule": "0 2 * * *"
        },
        {
            "source": "ods_table2.id",
            "target": "dwd_table2.id",
            "label": ""
        },
        {
            "source": "dwd_table1",
            "target": "dws_table1",
            "label": "proc_dwd_table1_to_dws_table1",
            "schedule": "0 2 * * *"
        },
        {
            "source": "dwd_table1.id",
            "target": "dws_table1.id",
            "label": ""
        },
        {
            "source": "dwd_table2",
            "target": "dws_table2",
            "label": "proc_dwd_table2_to_dws_table2",
            "schedule": "0 2 * * *"
        },
        {
            "source": "dwd_table2.id",
            "target": "dws_table2.id",
            "label": ""
        },
        {
            "source": "dws_table1",
            "target": "ads_table1",
            "label": "proc_dws_table1_to_ads_table1",
            "schedule": "0 2 * * *"
        },
        {
            "source": "dws_table1.id",
            "target": "ads_table1.id",
            "label": ""
        },
        {
            "source": "dws_table2",
            "target": "ads_table2",
            "label": "proc_dws_table2_to_ads_table2",
            "schedule": "0 2 * * *"
        },
        {
            "source": "dws_table2.id",
            "target": "ads_table2.id",
            "label": ""
        }
    ],
}

const toggleNode = (type) => {
    const nodes = graph.getNodes()
    nodes.forEach((node) => {
        const model = node.getModel()
        if (model.type === type) {
            const visible = node.get('visible')
            graph.changeItemVisibility(node, !visible)
        }
    })
}


const legendData = [...new Set(graphData.nodes.map(node => node.type))].map(type => ({
    name: type === 'table' ? '表' : '接口',
    value: type,
    marker: { style: { fill: type === 'table' ? '#f00' : '#ff0' } }
}))

console.log(legendData)
let graph = null

onMounted(() => {
    nextTick(() => {
        const container = document.getElementById('container')

        const renderGraph = () => {

            const width = container.clientWidth
            const height = container.clientHeight

            if (graph) graph.destroy()

            G6.registerEdge(
                'cubic-horizontal',
                {
                    afterDraw(cfg, group) {
                        // get the first shape in the group, it is the edge's path here=
                        const shape = group.get('children')[0];
                        // the start position of the edge's path
                        const startPoint = shape.getPoint(0);

                        // add red circle shape
                        const circle = group.addShape('circle', {
                            attrs: {
                                x: startPoint.x,
                                y: startPoint.y,
                                fill: '#1890ff',
                                r: 3,
                            },
                            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                            name: 'circle-shape',
                        });

                        // animation for the red circle
                        circle.animate(
                            (ratio) => {
                                // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
                                // get the position on the edge according to the ratio
                                const tmpPoint = shape.getPoint(ratio);
                                // returns the modified configurations here, x and y here
                                return {
                                    x: tmpPoint.x,
                                    y: tmpPoint.y,
                                };
                            },
                            {
                                repeat: true, // Whether executes the animation repeatly
                                duration: 3000, // the duration for executing once
                            },
                        );
                    },
                },
                'cubic', // extend the built-in edge 'cubic'
            );
            G6.registerNode('custom-node', {
                draw(cfg, group) {
                    const rect = group.addShape('rect', {
                        attrs: { x: -110, y: -30, width: 220, height: 60, stroke: '#2B6CF6', radius: 8, fill: '#F0F5FF' },
                        name: 'rect-shape'
                    })

                    group.addShape('text', {
                        attrs: { text: cfg.label, x: 0, y: 0, fill: '#000', fontSize: 12, textAlign: 'center', textBaseline: 'middle' },
                        name: 'text-shape'
                    })

                    group.addShape('image', {
                        attrs: { img: 'https://img.icons8.com/ios/50/000000/view-details.png', x: 80, y: -25, width: 16, height: 16 },
                        name: 'icon-img'
                    })

                    return rect
                }
            }, 'rect')

            graph = new G6.Graph({
                plugins: [new G6.ToolBar({}),
                new G6.Legend({
                    data: legendData,
                    align: 'top',
                    layout: 'horizontal',
                    position: 'top',
                    trigger: 'click'
                })],
                container: 'container',
                width,
                height,
                layout: {
                    type: 'dagre',
                    rankdir: 'LR', nodesep: 200, ranksep: 110
                },
                modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'collapse-expand'] },
                defaultNode: { type: 'custom-node' },
                // defaultEdge: {
                //     type: 'cubic-horizontal',
                //     style: { stroke: '#888', endArrow: true },
                //     labelCfg: { autoRotate: true, style: { fontSize: 10, fill: '#555' } }
                // }
                defaultEdge: {
                    type: 'polyline',
                    style: {
                        stroke: '#888',
                        lineWidth: 2,
                        endArrow: {
                            path: G6.Arrow.triangle(5, 10, 10),
                            fill: '#888'
                        }
                    },
                    labelCfg: {
                        autoRotate: true,
                        style: {
                            fontSize: 10,
                            fill: '#555'
                        }
                    },
                    // polyline 参数
                    polyline: {
                        radius: 10,  // 拐角圆弧半径
                        offset: 10,  // 节点之间的最小距离
                        routeCfg: {
                            // 设定自动绕开规则
                            direction: ['H', 'V']  // 横向 → 纵向
                        }
                    }
                }
            })

            graph.on('node:click', (evt) => {
                const { item, target } = evt
                const model = item.getModel()
                if (target.get('name') === 'icon-img') {
                    selectedNodeFields.value = model.fields || []
                    dialogVisible.value = true
                } else {
                    if (model.children) {
                        graph.updateItem(item, { children: null })
                    } else if (model.fields) {
                        const children = model.fields.map(f => ({ id: `${model.id}.${f.name}`, label: f.name, parent: model.id }))
                        graph.addData({ nodes: children })
                        graph.layout()
                    }
                }
            })

            graph.on('edge:click', (evt) => {
                const model = evt.item.getModel()
                selectedEdgeInfo.value = { procedure: model.label, schedule: model.schedule }
                edgeDialogVisible.value = true
            })

            graph.data(graphData)
            graph.render()
            // graph.fitView()
            graph.zoomTo(1)
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
    height: 100vh;
    position: relative;
}

.graph-container {
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
