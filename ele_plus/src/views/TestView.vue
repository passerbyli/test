<template>
  <div id="field-graph" class="w-full h-full relative">
    <div v-if="selectedNode" class="absolute top-4 left-4 bg-white border rounded shadow p-4 z-10 max-w-md">
      1
      <h3 class="font-bold text-lg mb-2">表：{{ selectedNode.id }}</h3>
      <pre class="text-sm whitespace-pre-wrap cursor-pointer">
        <span
          v-for="line in selectedNode.label.split('\n').slice(2)"
          :key="line"
          @click="handleFieldClick(selectedNode.id, line.trim())"
          class="hover:text-blue-600"
        >{{ line }}\n</span>
      </pre>
      <button class="mt-2 text-blue-500 hover:underline" @click="selectedNode = null">关闭</button>
    </div>
    <div id="field-graph-canvas" class="w-full h-full"></div>
    <div v-if="tooltip.visible" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }" class="g6-tooltip">
      <div class="font-bold">字段：{{ tooltip.field }}</div>
      <div class="text-xs text-gray-500">属于表：{{ tooltip.table }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as G6 from '@antv/g6'

const selectedNode = ref(null)
const tooltip = ref({ visible: false, x: 0, y: 0, field: '', table: '' })

function handleFieldClick(table, field) {
  alert(`字段跳转: ${table}.${field}`)
  // TODO: 可拓展为字段级图谱跳转逻辑
}

onMounted(() => {
  const data = {
    nodes: [
      {
        id: 'orders',
        label: 'orders\n────────────\norder_id\nuser_id\namount\norder_time',
      },
      {
        id: 'users',
        label: 'users\n────────────\nuser_id\nusername\ncreated_at',
      },
      {
        id: 'tmp_raw_orders',
        label: 'tmp_raw_orders\n────────────\norder_id\nuser_id\namount\norder_time',
      },
      {
        id: 'user_stats',
        label: 'user_stats (CTE)\n────────────\nuser_id\norder_count\ntotal_amount',
      },
      {
        id: 'latest_orders',
        label: 'latest_orders (CTE)\n────────────\nuser_id\nlast_order',
      },
      {
        id: 'user_orders_wide',
        label:
          'user_orders_wide\n────────────\nuser_id\nusername\norder_count\ntotal_amount\nlast_order',
      },
      {
        id: 'user_orders_staging',
        label: 'user_orders_staging\n────────────\nuser_id\norder_count',
      },
      {
        id: 'tmp_final_orders',
        label: 'tmp_final_orders\n────────────\n(order_id, user_id, ...)',
      },
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
  }
  const data1 = {
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
  }
  const graph = new G6.Graph({
    container: 'field-graph-canvas',
    width: document.getElementById('field-graph-canvas').clientWidth,
    height: document.getElementById('field-graph-canvas').clientHeight,
    layout: {
      type: 'dagre',
      rankdir: 'LR',
      nodesep: 30,
      ranksep: 50,
    },
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    },
    defaultNode: {
      type: 'rect',
      size: [220, 110],
      style: {
        fill: '#ffffff',
        stroke: '#1890ff',
        radius: 8,
      },
      labelCfg: {
        style: {
          fontSize: 12,
          fill: '#000',
          lineHeight: 16,
          textAlign: 'left',
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
          fontSize: 10,
        },
      },
    },
  })



  const data2 = {
    nodes: [
      {
        id: '1',
        dataType: '1——接口',
        name: 'API1'
      },

      {
        id: '2',
        dataType: '2-存储过程',
        name: 'poc1'
      },

      {
        id: '3',
        dataType: '表',
        name: '3-table1',
        params: {
          type: "数据表"
        }
      },
      {
        id: '4',
        dataType: '表',
        name: '4-table2_dim',
        params: {
          type: "维表"
        }
      },
      {
        id: '5',
        dataType: 'ETL',
        name: '5-etl1',
        params: {

        }
      }, {
        id: '6',
        dataType: '表',
        name: '6-table3',
        params: {

        }
      },
    ],
    edges: [
      { source: '2', target: '1' },
      { source: '3', target: '2' },
      { source: '4', target: '2' },
      { source: '5', target: '4' },
      { source: '6', target: '5' }
    ],
  };


  graph.data(data)
  graph.render()

  graph.on('node:click', (evt) => {
    const model = evt.item.getModel()
    selectedNode.value = model
    graph.getEdges().forEach((edge) => {
      const edgeModel = edge.getModel()
      graph.setItemState(
        edge,
        'highlight',
        edgeModel.source === model.id || edgeModel.target === model.id,
      )
    })
    graph.getNodes().forEach((n) => {
      const isLinked = graph.hasEdge(model.id, n.getID()) || graph.hasEdge(n.getID(), model.id)
      graph.setItemState(n, 'highlight', isLinked || n.getID() === model.id)
    })
  })

  graph.on('node:mouseenter', (evt) => {
    const model = evt.item.getModel()
    const shape = evt.target
    if (shape.cfg && shape.cfg.name === 'text') {
      const field = shape.cfg.text
      tooltip.value = {
        visible: true,
        x: evt.clientX + 10,
        y: evt.clientY + 10,
        field,
        table: model.id,
      }
    }
  })

  graph.on('node:mouseleave', () => {
    tooltip.value.visible = false
  })

  graph.on('canvas:click', () => {
    selectedNode.value = null
    tooltip.value.visible = false
    graph.getNodes().forEach((n) => graph.clearItemStates(n))
    graph.getEdges().forEach((e) => graph.clearItemStates(e))
  })
})
</script>

<style scoped>
#field-graph {
  width: 100%;
  height: 100vh;
  background: #fafafa;
}

.g6-tooltip {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 10px;
  border: 1px solid #ccc;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 100;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

#field-graph-canvas {
  height: 100vh;
}
</style>
