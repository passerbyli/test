<template>
    <div id="container" style="width: 100%; height: 100%; overflow: hidden;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import G6 from '@antv/g6'

const nodes = [
    { id: 'dwd_user', label: 'dwd_user', type: 'physical' },
    { id: 'dim_org', label: 'dim_org', type: 'physical' },
    { id: 'tmp_user_calc', label: 'tmp_user_calc', type: 'temporary' },
    { id: 'proc_user_agg', label: 'proc_user_agg', type: 'procedure' },
    { id: 'ads_user_agg', label: 'ads_user_agg', type: 'physical' },
]

const edges = [
    { source: 'dwd_user', target: 'tmp_user_calc', label: 'read' },
    { source: 'dim_org', target: 'tmp_user_calc', label: 'read' },
    { source: 'tmp_user_calc', target: 'proc_user_agg', label: 'read' },
    { source: 'proc_user_agg', target: 'ads_user_agg', label: 'write' },
]

onMounted(() => {
    const container = document.getElementById('container')
    const graph = new G6.Graph({
        container: 'container',
        width: container.scrollWidth,
        height: container.scrollHeight,
        layout: {
            type: 'dagre',
            rankdir: 'LR',
            nodesep: 50,
            ranksep: 120,
        },
        modes: {
            default: ['drag-node', 'zoom-canvas', 'drag-canvas'],
        },
        defaultNode: {
            type: 'rect',
            size: [120, 40],
            style: {
                radius: 6,
                stroke: '#5B8FF9',
                fill: (d) => {
                    if (d.type === 'temporary') return '#FFF7E6'
                    if (d.type === 'physical') return '#E6F7FF'
                    return '#F9F0FF'
                },
            },
            labelCfg: {
                style: {
                    fill: '#000',
                    fontSize: 14,
                },
            },
        },
        defaultEdge: {
            type: 'cubic-horizontal',
            style: {
                stroke: '#ccc',
            },
            labelCfg: {
                style: {
                    fill: '#888',
                    fontSize: 12,
                },
            },
        },
    })

    graph.data({ nodes, edges })
    graph.render()
    graph.fitCenter()

    window.addEventListener('resize', () => {
        if (!graph || graph.get('destroyed')) return
        graph.changeSize(container.scrollWidth, container.scrollHeight)
        graph.fitCenter()
    })
})
</script>

<style scoped>
#container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>