<template>
    <foldLeft>
        <template v-slot:left>
            <el-input v-model="filterText" placeholder="搜索表或存储过程..." @input="filterNode" />
            <el-tree :data="treeData" :props="defaultProps" node-key="id" :filter-node-method="filterMethod"
                ref="treeRef" @node-click="handleNodeClick" highlight-current :default-expand-all="true" />
        </template>
        <template v-slot:main>
            <div v-if="selectedNode">
                <h3>{{ selectedNode.label }}</h3>
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="表信息" name="first">
                        <pre>{{ JSON.stringify(selectedNode, null, 2) }}</pre>
                    </el-tab-pane>
                    <el-tab-pane label="血缘图" name="second" style="height: 500px; width: 100%;">
                        <el-switch v-model="closed" @change="changeClosed" />
                        {{ direction }}
                        <el-radio-group v-model="direction" size="small" @change="changeDirection">
                            <el-radio-button label="both" value="both" />
                            <el-radio-button label="up" value="up" />
                            <el-radio-button label="down" value="down" />
                        </el-radio-group>
                        {{ level }}
                        <el-radio-group v-model="level" size="small" @change="changeLevel">
                            <el-radio-button label="1" value="1" />
                            <el-radio-button label="2" value="2" />
                            <el-radio-button label="3" value="3" />
                            <el-radio-button label="4" value="4" />
                            <el-radio-button label="5" value="5" />
                            <el-radio-button label="6" value="6" />
                        </el-radio-group>
                        <!-- {{ graphData }} -->
                        <blood-relationship :graph-data="graphData" />
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div v-else>
                <p>请选择表或存储过程查看详情</p>
            </div>
        </template>
    </foldLeft>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElInput, ElTree } from 'element-plus'
import BloodRelationship from './BloodRelationship.vue'
import FoldLeft from '../layout/FoldLeft.vue'


const filterText = ref('')
const treeRef = ref()
const selectedNode = ref({ label: 'xx' })
const handleClick = (tab, event) => {
    console.log('当前点击的 tab name:', tab, event)
}
let treeData = ref([])
let activeName = ref('second')
let graphData = ref({
    nodes: [
        {
            nodeType: 'ods',
            id: 'ods_user',
            label: 'ODS原始用户表',
            alias: 'ODS原始用户表',
            schema: 'ods',
            fields: [
                {
                    name: 'user_id', type: 'varchar', length: 32, primaryKey: true
                },
                {
                    name: 'user_name', type: 'varchar', length: 128, primaryKey: false
                }
            ]
        },
        {
            id: 'dwd_user_info',
            label: 'DWD用户信息宽表',
            alias: 'DWD用户信息宽表',
            schema: 'dwd',
            fields: [
                {
                    name: 'user_id', type: 'varchar', length: 32, primaryKey: true
                },
                {
                    name: 'gender', type: 'varchar', length: 2, primaryKey: false
                }
            ]
        },
        {
            id: 'dws_user_summary',
            label: 'DWS用户汇总表',
            alias: 'DWS用户汇总表',
            schema: 'dws',
            fields: [
                {
                    name: 'user_id', type: 'varchar', length: 32, primaryKey: true
                },
                {
                    name: 'total_orders', type: 'int', length: 4, primaryKey: false
                }
            ]
        },
        {
            id: 'ads_user_behavior',
            label: 'ADS用户行为表',
            alias: 'ADS用户行为表',
            schema: 'ads',
            fields: [
                {
                    name: 'user_id', type: 'varchar', length: 32, primaryKey: true
                },
                {
                    name: 'summary_score', type: 'float', length: 8, primaryKey: false
                }
            ]
        }
    ],
    edges: [
        {
            source: 'ods_user', target: 'dwd_user_info', label: 'proc_etl_user_clean', schedule: '0 2 * * *'
        },
        {
            source: 'dwd_user_info', target: 'dws_user_summary', label: 'proc_user_summary', schedule: '0 3 * * *'
        },
        {
            source: 'dws_user_summary', target: 'ads_user_behavior', label: 'proc_user_behavior_export', schedule: '0 4 * * *'
        }
    ]
})
onMounted(() => {
    if (window.ipc) {
        window.ipc.sendInvoke('toMain', { event: 'getDBQuery', params: { sql: 'select * from ads_dl.metadata_table' } }).then(tables => {
            let schemas = []
            tables.forEach(table => {
                let temp = schemas.find(it => table.schema_name == it.label)
                if (temp) {
                    temp.children[0].children.push({ label: table.name, type: 'table' })
                } else {
                    let _tmp = {
                        label: table.schema_name,
                        children: [
                            {
                                label: '表',
                                children: [
                                    {
                                        type: 'table',
                                        label: table.name
                                    }
                                ]
                            },
                            {
                                label: '存过',
                                children: []
                            }
                        ]
                    }
                    schemas.push(_tmp)
                }
            })
            treeData.value = schemas

        })
    }
})





const defaultProps = {
    children: 'children',
    label: 'label'
}

const direction = ref('both')
const level = ref('1')
const closed = ref(true)
const filterNode = (value) => {
    treeRef.value.filter(value)
}

const filterMethod = (value, data) => {
    if (!value) return true
    return data.label.toLowerCase().includes(value.toLowerCase())
}

const changeClosed = () => {
    if (window.ipc) {
        window.ipc.sendInvoke('toMain', {
            event: 'kg', params: {
                name: selectedNode.value.label,
                level: level.value,
                direction: direction.value,
                closed: closed.value
            }
        }).then(tables => {
            console.log(tables)
            tables.edges.forEach(it => {
                it.schedule = 'xx'
                it.alias = 'qqq'
            })
            let _nodes = []
            tables.nodes.forEach((it) => {
                _nodes.push({
                    active: it.label == selectedNode.value.label,
                    id: it.id,
                    label: it.label,
                    alias: it.alias,
                    schema: it.schema,
                    fields: []
                })
            })
            tables.nodes = _nodes

            graphData.value = tables
        })
    }
}

const changeDirection = () => {
    if (window.ipc) {
        window.ipc.sendInvoke('toMain', {
            event: 'kg', params: {
                name: selectedNode.value.label,
                level: level.value,
                direction: direction.value,
                closed: closed.value
            }
        }).then(tables => {
            console.log(tables)
            tables.edges.forEach(it => {
                it.schedule = 'xx'
                it.alias = 'qqq'
            })
            let _nodes = []
            tables.nodes.forEach((it) => {
                _nodes.push({
                    active: it.label == selectedNode.value.label,
                    id: it.id,
                    label: it.label,
                    alias: it.alias,
                    schema: it.schema,
                    fields: []
                })
            })
            tables.nodes = _nodes

            graphData.value = tables
        })
    }
}

const changeLevel = (val) => {
    console.log(val)
    if (window.ipc) {
        window.ipc.sendInvoke('toMain', {
            event: 'kg', params: {

                name: selectedNode.value.label,
                level: level.value,
                direction: direction.value,
                closed: closed.value
            }
        }).then(tables => {
            console.log(tables)
            tables.edges.forEach(it => {
                it.schedule = 'xx'
                it.alias = 'qqq'
            })
            let _nodes = []
            tables.nodes.forEach((it) => {
                _nodes.push({
                    active: it.label == selectedNode.value.label,
                    id: it.id,
                    label: it.label,
                    alias: it.alias,
                    schema: it.schema,
                    fields: []
                })
            })
            tables.nodes = _nodes

            graphData.value = tables
        })
    }


}

const handleNodeClick = (node) => {
    if (node.type === 'table' || node.type === 'procedure') {
        selectedNode.value = node

        if (window.ipc) {
            window.ipc.sendInvoke('toMain', {
                event: 'kg', params: {
                    name: selectedNode.value.label,
                    level: level.value,
                    direction: direction.value,
                    closed: closed.value
                }
            }).then(tables => {
                console.log(tables)
                tables?.edges.forEach(it => {
                    it.schedule = 'xx'
                    it.alias = 'qqq'
                })
                let _nodes = []
                tables?.nodes.forEach((it) => {
                    _nodes.push({
                        active: it.label == selectedNode.value.label,
                        id: it.id,
                        label: it.label,
                        alias: it.alias,
                        schema: it.schema,
                        fields: it.fields
                    })
                })
                tables.nodes = _nodes

                graphData.value = tables
            })
        }
    }
}
</script>

<style></style>