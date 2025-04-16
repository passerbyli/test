<template>
    <div class="schema-tree-layout">
        <div class="left-panel">
            <el-input v-model="filterText" placeholder="搜索表或存储过程..." @input="filterNode" />
            <el-tree :data="treeData" :props="defaultProps" node-key="id" :filter-node-method="filterMethod"
                ref="treeRef" @node-click="handleNodeClick" highlight-current />
        </div>
        <div class="right-panel">
            <div v-if="selectedNode">
                <h3>{{ selectedNode.label }}</h3>
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="表信息" name="first">
                        <pre>{{ JSON.stringify(selectedNode, null, 2) }}</pre>
                    </el-tab-pane>
                    <el-tab-pane label="血缘图" name="second" style="height: 500px; width: 100%;">
                        <blood-relationship :graph-data="graphData" />
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div v-else>
                <p>请选择表或存储过程查看详情</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElInput, ElTree } from 'element-plus'
import BloodRelationship from './BloodRelationship.vue'

const filterText = ref('')
const treeRef = ref()
const selectedNode = ref(null)
const handleClick = () => {

}
let treeData = ref([])
let activeName = ref('second')
let graphData = {
    nodes: [
        {
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
}
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

const filterNode = (value) => {
    treeRef.value.filter(value)
}

const filterMethod = (value, data) => {
    if (!value) return true
    return data.label.toLowerCase().includes(value.toLowerCase())
}

const handleNodeClick = (node) => {
    if (node.type === 'table' || node.type === 'procedure') {
        selectedNode.value = node
    }
}
</script>

<style>
.schema-tree-layout {
    display: flex;
    height: 100vh;
}

.left-panel {
    width: 220px;
    padding: 10px;
    border-right: 1px solid #eee;
    overflow-y: auto;
}

.right-panel {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}
</style>