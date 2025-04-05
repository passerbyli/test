<template>
  <div id="field-graph" class="w-full h-full relative">
    <div
      v-if="tooltip.visible"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      class="absolute bg-white border p-2 text-sm rounded shadow z-10"
    >
      <div>
        <strong>{{ tooltip.field }}</strong>
      </div>
      <div class="text-gray-500">所属表：{{ tooltip.table }}</div>
      <div class="mt-2 space-y-1">
        <button @click="highlightSources" class="text-blue-500 hover:underline">查看来源字段</button
        ><br />
        <button @click="highlightTargets" class="text-blue-500 hover:underline">
          查看去向字段
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as G6 from '@antv/g6'

const tooltip = ref({ visible: false, x: 0, y: 0, field: '', table: '', nodeId: '', shape: null })
let graphInstance = null

function highlightSources() {
  const key = `${tooltip.value.table}.${tooltip.value.field}`
  graphInstance.getEdges().forEach((e) => {
    const model = e.getModel()
    if (model.target === tooltip.value.table) {
      graphInstance.setItemState(e, 'highlight', model.targetAnchor === tooltip.value.anchor)
    } else {
      graphInstance.setItemState(e, 'highlight', false)
    }
  })
}

function highlightTargets() {
  const key = `${tooltip.value.table}.${tooltip.value.field}`
  graphInstance.getEdges().forEach((e) => {
    const model = e.getModel()
    if (model.source === tooltip.value.table) {
      graphInstance.setItemState(e, 'highlight', model.sourceAnchor === tooltip.value.anchor)
    } else {
      graphInstance.setItemState(e, 'highlight', false)
    }
  })
}

onMounted(() => {
  const tables = [
    { name: 'orders', fields: ['order_id', 'customer_id'] },
    { name: 'special_orders', fields: ['oid', 'cid'] },
  ]

  const edges = [
    { source: 'orders.order_id', target: 'special_orders.oid' },
    { source: 'orders.customer_id', target: 'special_orders.cid' },
  ]

  const g6nodes = tables.map((table) => {
    const height = (table.fields.length + 1) * 20 + 10
    return {
      id: table.name,
      label: table.name,
      type: 'table-node',
      size: [200, height],
      fields: table.fields,
    }
  })

  const g6edges = edges.map(({ source, target }) => {
    const [sourceTable, sourceField] = source.split('.')
    const [targetTable, targetField] = target.split('.')
    return {
      source: sourceTable,
      target: targetTable,
      sourceAnchor: tables.find((t) => t.name === sourceTable)?.fields.indexOf(sourceField) + 1,
      targetAnchor: tables.find((t) => t.name === targetTable)?.fields.indexOf(targetField) + 1,
    }
  })

  G6.registerNode(
    'table-node',
    {
      draw(cfg, group) {
        const { label, fields } = cfg
        const width = 200
        const height = (fields.length + 1) * 20 + 10

        const keyShape = group.addShape('rect', {
          attrs: {
            x: -width / 2,
            y: -height / 2,
            width,
            height,
            radius: 4,
            stroke: '#5B8FF9',
            fill: '#fff',
          },
          name: 'table-box',
          draggable: true,
        })

        group.addShape('text', {
          attrs: {
            text: label,
            x: 0,
            y: -height / 2 + 20,
            fontSize: 14,
            fill: '#000',
            textAlign: 'center',
            textBaseline: 'middle',
          },
          name: 'table-title',
        })

        fields.forEach((field, index) => {
          const y = -height / 2 + 20 * (index + 2)
          group.addShape('text', {
            attrs: {
              text: field,
              x: -width / 2 + 20,
              y,
              fontSize: 12,
              fill: '#333',
              textAlign: 'start',
              textBaseline: 'middle',
            },
            name: `field-${field}`,
          })
          group.addShape('rect', {
            attrs: {
              x: -width / 2,
              y: y - 10,
              width: width,
              height: 20,
              fill: 'transparent',
              cursor: 'pointer',
            },
            name: `field-bg-${field}`,
          })
        })

        return keyShape
      },
      getAnchorPoints(cfg) {
        const anchors = cfg.fields.map((_, idx) => [0, (idx + 2) / (cfg.fields.length + 3)])
        return anchors
      },
    },
    'single-node',
  )

  const graph = new G6.Graph({
    container: 'field-graph',
    width: window.innerWidth,
    height: window.innerHeight,
    layout: {
      type: 'dagre',
      rankdir: 'LR',
      nodesep: 50,
      ranksep: 100,
    },
    defaultNode: {
      type: 'table-node',
    },
    defaultEdge: {
      style: {
        stroke: '#999',
        endArrow: true,
      },
      stateStyles: {
        highlight: {
          stroke: '#f00',
          lineWidth: 2,
        },
      },
    },
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    },
  })

  graph.data({ nodes: g6nodes, edges: g6edges })
  graph.render()
  graphInstance = graph

  graph.on('node:contextmenu', (evt) => {
    evt.preventDefault()
    const model = evt.item.getModel()
    const { shape } = evt
    if (!shape || !shape.cfg.name?.startsWith('field-')) return
    const fieldName = shape.cfg.name.replace('field-', '')
    const fieldIdx = model.fields.indexOf(fieldName)

    tooltip.value = {
      visible: true,
      x: evt.clientX,
      y: evt.clientY,
      table: model.id,
      field: fieldName,
      anchor: fieldIdx + 1,
    }
  })

  graph.on('canvas:click', () => {
    tooltip.value.visible = false
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
</style>
