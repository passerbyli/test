<template>
    <div ref="container" style="width: 100%; height: 100%"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import G6 from '@antv/g6'
import jsonData from '../../plugins/sqlParse/sql_analysis_result.json';
const container = ref(null)

const graphData = jsonData[0]
onMounted(() => {
    const graph = new G6.Graph({
        container: container.value,
        width: container.value.clientWidth,
        height: container.value.clientHeight,
        layout: { type: 'dagre', rankdir: 'LR' },
        defaultNode: {
            type: 'rect',
            size: [120, 40],
            style: {
                radius: 8,
                stroke: '#666',
                fill: '#fff'
            },
            labelCfg: { style: { fill: '#000', fontSize: 12 } }
        },
        defaultEdge: {
            type: 'cubic-horizontal',
            style: {
                stroke: '#999',
                endArrow: true
            },
            labelCfg: {
                autoRotate: true,
                style: {
                    fontSize: 10,
                    fill: '#666'
                }
            }
        },
        modes: {
            default: ['drag-node', 'zoom-canvas', 'drag-canvas']
        }
    })

    // 设置颜色
    graphData.nodes.forEach(node => {
        if (node.type === 'function') node.style = { fill: '#FFB6C1' }
        else if (node.isTemporary) node.style = { fill: '#FFD700' }
        else node.style = { fill: '#87CEFA' }
    })

    graph.data(graphData)
    graph.render()
    graph.fitView()


})
</script>