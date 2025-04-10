<template>
  11222xxs
  <div id="field-graph" class="w-full h-full"></div>
  22
</template>

<script setup>
import { onMounted } from 'vue'
import * as G6 from '@antv/g6'

// mock 数据
const tables = [
  {
    name: 'customers',
    fields: ['credit_limit', 'cust_email', 'customer_id'],
  },
  {
    name: 'orders',
    fields: ['order_id', 'customer_id', 'order_total', 'sales_rep_id'],
  },
  {
    name: 'INSERT-SELECT-1',
    fields: ['oid', 'cid', 'ottl', 'sid', 'cl', 'cem', 'RelationRows'],
  },
  {
    name: 'small_orders',
    fields: ['oid', 'ottl', 'sid', 'cid', 'cl', 'cem', 'RelationRows'],
  },
  {
    name: 'medium_orders',
    fields: ['oid', 'ottl', 'sid', 'cid', 'cl', 'cem', 'RelationRows'],
  },
  {
    name: 'special_orders',
    fields: ['oid', 'ottl', 'sid', 'cid', 'cl', 'cem', 'RelationRows'],
  },
  {
    name: 'large_orders',
    fields: ['oid', 'ottl', 'sid', 'cid', 'cl', 'cem', 'RelationRows'],
  },
]

const edges = [
  { source: 'orders.order_id', target: 'INSERT-SELECT-1.oid' },
  { source: 'orders.customer_id', target: 'INSERT-SELECT-1.cid' },
  { source: 'orders.order_total', target: 'INSERT-SELECT-1.ottl' },
  { source: 'orders.sales_rep_id', target: 'INSERT-SELECT-1.sid' },
  { source: 'customers.credit_limit', target: 'INSERT-SELECT-1.cl' },
  { source: 'customers.cust_email', target: 'INSERT-SELECT-1.cem' },
  { source: 'INSERT-SELECT-1.oid', target: 'small_orders.oid' },
  { source: 'INSERT-SELECT-1.cid', target: 'small_orders.cid' },
  { source: 'INSERT-SELECT-1.ottl', target: 'small_orders.ottl' },
  { source: 'INSERT-SELECT-1.oid', target: 'medium_orders.oid' },
  { source: 'INSERT-SELECT-1.oid', target: 'special_orders.oid' },
  { source: 'INSERT-SELECT-1.oid', target: 'large_orders.oid' },
]

onMounted(() => {
  const nodeWidth = 200
  const fieldHeight = 20

  const g6nodes = tables.map((table, i) => {
    const height = (table.fields.length + 1) * fieldHeight + 10
    return {
      id: table.name,
      label: table.name,
      type: 'table-node',
      size: [nodeWidth, height],
      fields: table.fields,
      style: {
        fill: '#fefefe',
        stroke: '#5b8ff9',
      },
    }
  })

  const g6edges = edges.map(({ source, target }) => {
    return {
      source: source.split('.')[0],
      target: target.split('.')[0],
      sourceAnchor:
        tables.find((t) => t.name === source.split('.')[0])?.fields.indexOf(source.split('.')[1]) +
        1,
      targetAnchor:
        tables.find((t) => t.name === target.split('.')[0])?.fields.indexOf(target.split('.')[1]) +
        1,
    }
  })

  G6.registerNode(
    'table-node',
    {
      draw(cfg, group) {
        const { label, fields } = cfg
        const width = 200
        const fieldHeight = 20
        const height = (fields.length + 1) * fieldHeight + 10

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
            y: -height / 2 + fieldHeight,
            fontSize: 14,
            fill: '#000',
            textAlign: 'center',
            textBaseline: 'middle',
          },
          name: 'table-title',
        })

        fields.forEach((field, index) => {
          group.addShape('circle', {
            attrs: {
              x: -width / 2 + 6,
              y: -height / 2 + fieldHeight * (index + 2),
              r: 3,
              fill: '#5B8FF9',
            },
            name: `anchor-${index + 1}`,
          })

          group.addShape('text', {
            attrs: {
              text: field,
              x: -width / 2 + 16,
              y: -height / 2 + fieldHeight * (index + 2),
              fontSize: 12,
              fill: '#333',
              textAlign: 'start',
              textBaseline: 'middle',
            },
            name: `field-${field}`,
          })
        })

        return keyShape
      },
      getAnchorPoints(cfg) {
        const { fields } = cfg
        const anchors = fields.map((_, idx) => [0, (idx + 2) / (fields.length + 3)])
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
    },
    modes: {
      default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    },
  })

  graph.data({ nodes: g6nodes, edges: g6edges })
  graph.render()
})
</script>

<style scoped>
#field-graph {
  width: 100%;
  height: 100vh;
  background: #fafafa;
}
</style>
