<template>
    <div>
        <div class="toolbar">
            <select v-model="selectedOption" @change="fetchData">
                <option value="option1">数据源1</option>
                <option value="option2">数据源2</option>
            </select>
            <button @click="graph.fitView()">适应画布</button>
            <button @click="graph.zoom(1.2)">放大</button>
            <button @click="graph.zoom(0.8)">缩小</button>
        </div>
        <div id="container" style="width: 100%; height: calc(100vh - 40px);"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import G6 from '@antv/g6';

const graph = ref(null);
const selectedOption = ref('option1');

const mockData1 = {
    nodes: [
        { id: '1', dataType: '接口', name: 'API1' },
        { id: '2', dataType: '存储过程', name: 'proc1' },
        { id: '3', dataType: '表', name: 'table1', params: { type: '数据表' } },
        { id: '4', dataType: '表', name: 'dim_table2', params: { type: '维表' } },
        { id: '5', dataType: 'ETL', name: 'etl1' },
        { id: '6', dataType: '表', name: 'table3' },
    ],
    edges: [
        { source: '2', target: '1' },
        { source: '3', target: '2' },
        { source: '4', target: '2' },
        { source: '5', target: '4' },
        { source: '6', target: '5', label: '提供数据' },
    ]
};

const mockData2 = {
    nodes: [
        { id: '11', dataType: '接口', name: 'API2' },
        { id: '12', dataType: '存储过程', name: 'proc2' },
        { id: '13', dataType: '表', name: 'tableA', params: { type: '维表' } },
        { id: '14', dataType: '表', name: 'tableB', params: { type: '数据表' } },
    ],
    edges: [
        { source: '12', target: '11' },
        { source: '13', target: '12' },
        { source: '14', target: '12', label: '依赖' },
    ]
};

const fetchData = async () => {
    const response = selectedOption.value === 'option1' ? mockData1 : mockData2;
    renderGraph(response);
};

const getColor = (dataType, params) => {
    if (params?.type === '维表') return '#FFA940';
    if (dataType.includes('接口')) return '#5B8FF9';
    if (dataType.includes('存储过程')) return '#61DDAA';
    if (dataType.includes('ETL')) return '#FF99C3';
    return '#CDDDFD';
};

const renderGraph = (data) => {
    if (graph.value) graph.value.destroy();

    const container = document.getElementById('container');

    graph.value = new G6.Graph({
        container,
        width: container.scrollWidth,
        height: container.scrollHeight,
        layout: { type: 'dagre', rankdir: 'LR' },
        modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node'] },
        defaultEdge: {
            type: 'cubic-horizontal',
            style: { stroke: '#999', lineWidth: 2 },
            labelCfg: { autoRotate: true, style: { fill: '#000', fontSize: 12, cursor: 'pointer' } },
            endArrow: { path: G6.Arrow.triangle(10, 12, 4), d: 4 },
        },
        defaultNode: {
            type: 'rect',
            size: [120, 40],
            style: { radius: 4 },
            labelCfg: { style: { fill: '#000', fontSize: 12 } },
        },
    });

    const collapsedNodes = new Set();

    graph.value.node((node) => {
        return {
            label: node.name,
            style: { fill: getColor(node.dataType, node.params), stroke: '#333' },
            markerCfg: node.params?.type !== '维表' ? {
                show: true,
                position: 'right',
                r: 6,
                style: { stroke: '#000', fill: '#fff', cursor: 'pointer' },
            } : undefined
        };
    });

    graph.value.data(data);
    graph.value.render();
    graph.value.fitView();

    data.nodes.forEach((node) => {
        if (node.params?.type === '维表') {
            collapseUpstream(graph.value, node.id);
        }
    });

    graph.value.on('node:marker:click', (e) => {
        const model = e.item.getModel();
        alert(`查看节点信息：${model.name}`);
    });

    graph.value.on('node:click', (e) => {
        const model = e.item.getModel();
        if (model.params?.type === '维表') {
            const target = e.target;
            if (target.get('name') && target.get('name').includes('marker')) {
                // 点击查看按钮不触发展开收拢
                return;
            }
            const nodeId = e.item.getID();
            if (collapsedNodes.has(nodeId)) {
                expandUpstream(graph.value, nodeId);
                collapsedNodes.delete(nodeId);
            } else {
                collapseUpstream(graph.value, nodeId);
                collapsedNodes.add(nodeId);
            }
        } else {
            alert(`查看节点信息：${model.name}`);
        }
    });

    graph.value.on('edge:click', (e) => {
        const model = e.item.getModel();
        alert(`查看边信息：${model.label}`);
    });
};


const collapseUpstream = (graph, nodeId) => {
    const edges = graph.getEdges().filter((edge) => edge.getTarget().getID() === nodeId);
    edges.forEach((edge) => {
        const sourceNode = edge.getSource();
        graph.hideItem(sourceNode);
        graph.hideItem(edge);
        collapseUpstream(graph, sourceNode.getID());
    });
};

const expandUpstream = (graph, nodeId) => {
    const edges = graph.getEdges().filter((edge) => edge.getTarget().getID() === nodeId);
    edges.forEach((edge) => {
        const sourceNode = edge.getSource();
        graph.showItem(sourceNode);
        graph.showItem(edge);
        expandUpstream(graph, sourceNode.getID());
    });
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
#container {
    background-color: #f5f5f5;
}

.toolbar {
    height: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 10px;
    background: #fff;
    border-bottom: 1px solid #ddd;
}
</style>