<template>
    <div class="graph-wrapper" ref="graphWrapper">
        <!-- 工具栏 -->
        <div class="toolbar">
            <el-button size="small" @click="graph?.fitView()">适应画布</el-button>
            <el-button size="small" @click="graph?.zoom(1.1)">放大</el-button>
            <el-button size="small" @click="graph?.zoom(0.9)">缩小</el-button>
            <el-button size="small" @click="graph?.zoomTo(1)">1:1</el-button>
            <el-button size="small" @click="refreshGraph()">刷新</el-button>
        </div>
        <div class="legend">
            <div @click="toggleNode('table')"><span class="legend-icon table"></span> 表</div>
            <div @click="toggleNode('api')"><span class="legend-icon api"></span> 接口</div>
        </div>
        <div id="container" class="graph-container"></div>

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
import { onMounted, ref, nextTick, onBeforeUnmount, watch } from 'vue'
import G6 from '@antv/g6'

const dialogVisible = ref(false)
const edgeDialogVisible = ref(false)
const selectedNodeFields = ref([])
const selectedEdgeInfo = ref({})

const props = defineProps({
    graphData: {
        type: Object,
        required: true
    }
})

const graphWrapper = ref()


let graph = null




watch(() => props.graphData, () => {
    nextTick(() => refreshGraph())
}, {
    deep: true,
    immediate: true
})

const toggleNode = (type) => {
    if (graph) {
        const nodes = graph.getNodes()
        nodes.forEach((node) => {
            const model = node.getModel()
            if (model.type === type) {
                const visible = node.get('visible')
                graph.changeItemVisibility(node, !visible)
            }
        })
    }
}


const legendData = [...new Set(props.graphData?.nodes?.map(node => node.type))]?.map(type => ({
    name: type === 'table' ? '表' : '接口',
    value: type,
    marker: { style: { fill: type === 'table' ? '#f00' : '#ff0' } }
}))

const entityTypeColor = {
    Table: '#5B8FF9',
    Procedure: '#D3C6EA',
    Interface: '#F6BD16',
    System: '#A0A0A0'
}
onMounted(() => {
    refreshGraph()
})

// 图渲染逻辑
const refreshGraph = () => {
    if (!props.graphData?.nodes) return

    const container = document.getElementById('container')

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
        layout: { type: 'dagre', rankdir: 'LR', nodesep: 0, ranksep: 80, sortByCombo: true },
        combos: [
            { id: 'ods', label: 'ODS 层' },
            { id: 'dwd', label: 'DWD 层' },
            { id: 'dws', label: 'DWS 层' },
            { id: 'ads', label: 'ADS 层' }
        ],
        plugins: [
            // new G6.ToolBar({}),
            new G6.Legend({
                data: legendData,
                align: 'top',
                layout: 'horizontal',
                position: 'top',
                trigger: 'click'
            }),
            new G6.Minimap({
                size: [150, 100],
            })],
        width,
        height,
        modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'collapse-expand'] },
        defaultNode: {
            type: 'custom-node',
        },
        defaultEdge: {
            type: 'cubic-horizontal',
            style: { stroke: '#888', endArrow: true },
            labelCfg: { autoRotate: true, style: { fontSize: 10, fill: '#555' } }
        },
    })


    // 初始化加载完毕后自动 fitView
    graph.once('afterrender', () => {
        graph.fitView()
    })

    graph.on('node:click', (evt) => {
        const { item, target } = evt
        const model = item.getModel()
        if (target.get('name') === 'icon-img') {
            selectedNodeFields.value = model.fields || []
            dialogVisible.value = true
        } else {
            // if (model.children) {
            //     graph.updateItem(item, { children: null })
            // } else if (model.fields) {
            //     const children = model.fields.map(f => ({ id: `${model.id}.${f.name}`, label: f.name, parent: model.id }))
            //     graph.addData({ nodes: children })
            //     graph.layout()
            // }
        }
    })

    graph.on('edge:click', (evt) => {
        const model = evt.item.getModel()
        selectedEdgeInfo.value = { procedure: model.label, schedule: model.schedule }
        edgeDialogVisible.value = true
    })

    graph.data(props.graphData)
    graph.render()
    graph.fitView()


    window.addEventListener('resize', () => {
        graph?.changeSize(window.innerWidth, window.innerHeight - 50)
    })
    // // 根据图例过滤数据
    // const displayNodes = nodes.filter((n) => legendType.value[n.entityType])
    // const displayEdges = edges.filter(
    //     (e) => displayNodes.find((n) => n.id === e.source) && displayNodes.find((n) => n.id === e.target)
    // )

    // graph.changeData({ nodes: displayNodes, edges: displayEdges })
    graph.fitView()
}
onBeforeUnmount(() => {
    graph?.destroy()
})
</script>

<style>
.graph-wrapper {
    width: 95%;
    height: 95%;
    position: relative;
    border: 1px solid #f00;
}

.toolbar {
    height: 40px;
    padding: 5px 10px;
    background: #f5f5f5;
    display: flex;
    gap: 10px;
    align-items: center;
}

.graph-container {
    width: 100%;
    height: calc(100% - 40px);
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
