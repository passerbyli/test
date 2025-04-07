import G6 from '@antv/g6'

const data = {
  nodes: [
    { id: '接口A', label: '接口A' },
    { id: 'ads.table1', label: 'ads.table1' },
    { id: 'ads.table2', label: 'ads.table2' },
    { id: 'dim.area', label: 'dim.area' },
    { id: 'dws.dws_table1', label: 'dws.dws_table1' },
    { id: 'dws.dws_table2', label: 'dws.dws_table2' },
    { id: 'dws.dws_table3', label: 'dws.dws_table3' },
    { id: 'dws.dws_table4', label: 'dws.dws_table4' },
    { id: 'dmd.dmd_table1', label: 'dmd.dmd_table1' },
    { id: 'dmd.dmd_table2', label: 'dmd.dmd_table2' },
    { id: 'dmd.dmd_table3', label: 'dmd.dmd_table3' },
    { id: 'dmd.dmd_table4', label: 'dmd.dmd_table4' },
    { id: 'ods.ods_order1', label: 'ods.ods_order1' },
    { id: '系统A', label: '系统A' },
  ],
  edges: [
    { source: 'ads.table1', target: '接口A' },
    { source: 'ads.table2', target: '接口A' },
    { source: 'dim.area', target: '接口A' },
    { source: 'dws.dws_table1', target: 'ads.table1' },
    { source: 'dws.dws_table2', target: 'ads.table1' },
    { source: 'dws.dws_table3', target: 'ads.table2' },
    { source: 'dws.dws_table4', target: 'ads.table2' },
    { source: 'dmd.dmd_table1', target: 'dws.dws_table1' },
    { source: 'dmd.dmd_table2', target: 'dws.dws_table1' },
    { source: 'dmd.dmd_table1', target: 'dws.dws_table2' },
    { source: 'dmd.dmd_table2', target: 'dws.dws_table2' },
    { source: 'dmd.dmd_table3', target: 'dws.dws_table3' },
    { source: 'dmd.dmd_table4', target: 'dws.dws_table3' },
    { source: 'dmd.dmd_table3', target: 'dws.dws_table4' },
    { source: 'dmd.dmd_table4', target: 'dws.dws_table4' },
    { source: 'ods.ods_order1', target: 'dws.dws_table1' },
    { source: '系统A', target: 'ods.ods_order1' },
  ],
}

const container = document.getElementById('container')
const width = container.scrollWidth
const height = container.scrollHeight || 500
const graph = new G6.Graph({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
  layout: {
    type: 'dagre',
    rankdir: 'LR',
    nodesep: 40,
    ranksep: 100,
  },
  defaultNode: {
    type: 'rect',
    size: [140, 40],
    style: {
      fill: '#F6F9FF',
      stroke: '#A3B1BF',
      radius: 8,
    },
    labelCfg: {
      style: {
        fill: '#000',
        fontSize: 12,
      },
    },
  },
  defaultEdge: {
    type: 'polyline',
    style: {
      stroke: '#ccc',
      endArrow: true,
    },
  },
  modes: {
    default: ['drag-canvas', 'zoom-canvas', 'click-select'],
  },
})

graph.data(data)
graph.render()

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return
    if (!container || !container.scrollWidth || !container.scrollHeight) return
    graph.changeSize(container.scrollWidth, container.scrollHeight)
  }
