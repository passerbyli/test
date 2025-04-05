<template>
    <el-button @click="selectFolder">选择文件夹</el-button>
    <p>绝对路径：{{ path }}</p>
    <el-button type="" v-if="path" @click="analysisBtn">分析</el-button>
    <div id="table-graph" class="w-full h-full"></div>
</template>

<script>
import { defineComponent, toRefs, reactive, ref, onMounted } from 'vue';
import * as G6 from '@antv/g6';

export default defineComponent({
    name: 'DataLineageView',
    setup() {
        onMounted(() => {
            const data = {
                nodes: [
                    { id: 'orders', label: 'orders' },
                    { id: 'users', label: 'users' },
                    { id: 'tmp_raw_orders', label: 'tmp_raw_orders' },
                    { id: 'user_stats', label: 'user_stats (CTE)' },
                    { id: 'latest_orders', label: 'latest_orders (CTE)' },
                    { id: 'user_orders_wide', label: 'user_orders_wide' },
                    { id: 'user_orders_staging', label: 'user_orders_staging' },
                    { id: 'tmp_final_orders', label: 'tmp_final_orders' },
                ],
                edges: [
                    { source: 'orders', target: 'tmp_raw_orders' },
                    { source: 'users', target: 'tmp_raw_orders' },
                    { source: 'tmp_raw_orders', target: 'user_stats' },
                    { source: 'tmp_raw_orders', target: 'latest_orders' },
                    { source: 'user_stats', target: 'user_orders_wide' },
                    { source: 'latest_orders', target: 'user_orders_wide' },
                    { source: 'users', target: 'user_orders_wide' },
                    { source: 'user_orders_staging', target: 'user_orders_wide' },
                    { source: 'tmp_raw_orders', target: 'tmp_final_orders' },
                ],
            };

            const graph = new G6.Graph({
                container: 'table-graph',
                width: document.getElementById('table-graph').clientWidth,
                height: document.getElementById('table-graph').clientHeight,
                layout: {
                    type: 'dagre',
                    rankdir: 'LR',
                    nodesep: 30,
                    ranksep: 50,
                },
                modes: {
                    default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
                },
                plugins: [{
                    type: 'fullscreen',
                    key: 'fullscreen',
                },
                function () {
                    const graph = this;
                    return {
                        type: 'toolbar',
                        key: 'toolbar',
                        position: 'top-left',
                        onClick: (item) => {
                            const fullscreenPlugin = graph.getPluginInstance('fullscreen');
                            if (item === 'request-fullscreen') {
                                fullscreenPlugin.request();
                            }
                            if (item === 'exit-fullscreen') {
                                fullscreenPlugin.exit();
                            }
                        },
                        getItems: () => {
                            return [
                                { id: 'request-fullscreen', value: 'request-fullscreen' },
                                { id: 'exit-fullscreen', value: 'exit-fullscreen' },
                            ];
                        },
                    };
                },],
                defaultNode: {
                    type: 'rect',
                    size: [120, 40],
                    style: {
                        fill: '#e0f0ff',
                        stroke: '#1890ff',
                        radius: 6,
                    },
                    labelCfg: {
                        style: {
                            fontSize: 14,
                            fill: '#000',
                        },
                    },
                },
                defaultEdge: {
                    style: {
                        stroke: '#999',
                        endArrow: true,
                    },
                    labelCfg: {
                        style: {
                            fill: '#666',
                            fontSize: 12,
                        },
                    },
                },
            });

            graph.data(data);
            graph.render();
        });
        const path = ref('/Users/lihaomin/projects/GitHub/test/scripts/sqlParse/data')
        const selectFolder = async () => {
            if (window.ipc) {
                await window.ipc.sendInvoke('toMain', {
                    event: 'select-folder'
                }).then((result) => {
                    if (result) {
                        path.value = result[0]
                    }
                });
            }
        };

        const dataMap = reactive({
            analysisBtn: async () => {
                window.ipc.sendInvoke('toMain', {
                    event: 'data-lineage-analysis',
                    params: path.value
                }).then((result) => {
                    if (result) {
                        console.log(result)
                    }
                })
            },
            selectFolder,
            path
        })

        return {
            ...toRefs(dataMap)
        }
    }
});



</script>
<style scoped>
#table-graph {
    width: 100%;
    height: 100vh;
    background: #f5f5f5;
}
</style>