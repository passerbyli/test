import G6 from '@antv/g6'
import insertCss from 'insert-css'

insertCss(`
  .g6-tooltip {
    border-radius: 6px;
    font-size: 12px;
    color: #fff;
    background-color: #000;
    padding: 2px 8px;
    text-align: center;
  }
`)

const data = {
  nodes: [
    {
      id: '1',
      dataType: '1——接口',
      name: 'API1',
    },

    {
      id: '2',
      dataType: '2-存储过程',
      name: 'poc1',
    },

    {
      id: '3',
      dataType: '表',
      name: '3-table1',
      params: {
        type: '数据表',
      },
    },
    {
      id: '4',
      dataType: '表',
      name: '4-table2_dim',
      params: {
        type: '维表',
      },
    },
    {
      id: '5',
      dataType: 'ETL',
      name: '5-etl1',
      params: {},
    },
    {
      id: '6',
      dataType: '表',
      name: '6-table3',
      params: {},
    },
  ],
  edges: [
    { source: '2', target: '1' },
    { source: '3', target: '2' },
    { source: '4', target: '2' },
    { source: '5', target: '4' },
    { source: '6', target: '5', label: '' },
  ],
}

G6.registerNode(
  'sql',
  {
    drawShape(cfg, group) {
      const rect = group.addShape('rect', {
        attrs: {
          x: -75,
          y: -25,
          width: 150,
          height: 50,
          radius: 10,
          stroke: '#5B8FF9',
          fill: '#C6E5FF',
          lineWidth: 3,
        },
        name: 'rect-shape',
      })
      if (cfg.name) {
        group.addShape('text', {
          attrs: {
            text: cfg.name,
            x: 0,
            y: 0,
            fill: '#00287E',
            fontSize: 14,
            textAlign: 'center',
            textBaseline: 'middle',
            fontWeight: 'bold',
          },
          name: 'text-shape',
        })
      }
      return rect
    },
  },
  'single-node',
)

const container = document.getElementById('container')
const width = container.scrollWidth
const height = container.scrollHeight || 500
const graph = new G6.Graph({
  container: 'container',
  width,
  height,
  layout: {
    type: 'dagre',
    nodesepFunc: (d) => {
      if (d.id === '3') {
        return 500
      }
      return 50
    },
    ranksep: 70,
    controlPoints: true,
  },
  defaultNode: {
    type: 'sql',
  },
  defaultEdge: {
    type: 'polyline',
    style: {
      radius: 20,
      offset: 45,
      endArrow: true,
      lineWidth: 2,
      stroke: '#C2C8D5',
    },
  },
  nodeStateStyles: {
    selected: {
      stroke: '#d9d9d9',
      fill: '#5394ef',
    },
  },
  modes: {
    default: [
      'drag-canvas',
      'zoom-canvas',
      'click-select',
      {
        type: 'tooltip',
        formatText(model) {
          const cfg = model.conf
          const text = []
          cfg.forEach((row) => {
            text.push(row.label + ':' + row.value + '<br>')
          })
          return text.join('\n')
        },
        offset: 30,
      },
    ],
  },
  fitView: true,
})
graph.data(data)
graph.render()

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return
    if (!container || !container.scrollWidth || !container.scrollHeight) return
    graph.changeSize(container.scrollWidth, container.scrollHeight)
  }
