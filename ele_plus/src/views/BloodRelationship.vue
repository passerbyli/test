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
                <el-descriptions-item label="ID">{{ selectedEdgeInfo.id }}</el-descriptions-item>
                <el-descriptions-item label="名称">{{ selectedEdgeInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="存储过程">{{ selectedEdgeInfo.label }}</el-descriptions-item>
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
    console.log(props.graphData)
    nextTick(() => refreshGraph())
})



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
                const shape = group.get('children')[0];
                const startPoint = shape.getPoint(0);

                const circle = group.addShape('circle', {
                    attrs: {
                        x: startPoint.x,
                        y: startPoint.y,
                        fill: '#1890ff',
                        r: 3,
                    },
                    name: 'circle-shape',
                });

                circle.animate(
                    (ratio) => {
                        const tmpPoint = shape.getPoint(ratio);
                        return {
                            x: tmpPoint.x,
                            y: tmpPoint.y,
                        };
                    },
                    {
                        repeat: true,
                        duration: 3000,
                    },
                );
            },
        },
        'cubic',
    );

    G6.registerNode('custom-node', {
        draw(cfg, group) {
            if (cfg.active) {
                console.log('xxxx')
            }
            const rect = group.addShape('rect', {
                attrs: {
                    x: -110,
                    y: -30,
                    width: 220,
                    height: 60,
                    stroke: cfg.active ? '#f00' : '#2B6CF6',
                    radius: 8,
                    fill: cfg.active ? '#f00' : '#F0F5FF'
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
        layout: {
            type: 'dagre', //层次布局
            rankdir: 'LR',
            nodesep: 50,//节点间距
            ranksep: 140,//层间距
            controlPoints: true,
            sortByCombo: true//同一层节点是否根据每个节点数据中的 comboId 进行排序，以防止 combo 重叠
        },
        combos: [
            { id: 'ods', label: 'ODS 层' },
            { id: 'dwd', label: 'DWD 层' },
            { id: 'dws', label: 'DWS 层' },
            { id: 'ads', label: 'ADS 层' }
        ],
        plugins: [],
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

            selectedNodeFields.value = model.fields ? JSON.parse(model.fields) : []
            dialogVisible.value = true
        }
    })

    graph.on('edge:click', (evt) => {
        const model = evt.item.getModel()
        console.log(model)
        selectedEdgeInfo.value = model
        edgeDialogVisible.value = true
    })

    graph.data(props.graphData)

    graph.render()
    graph.fitView()


    window.addEventListener('resize', () => {
        graph?.changeSize(window.innerWidth, window.innerHeight - 50)
    })

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
</style>
