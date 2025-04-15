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
                <pre>{{ JSON.stringify(selectedNode, null, 2) }}</pre>
            </div>
            <div v-else>
                <p>请选择表或存储过程查看详情</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElInput, ElTree } from 'element-plus'

const filterText = ref('')
const treeRef = ref()
const selectedNode = ref(null)

const treeData = [
    {
        label: 'schema_ods',
        children: [
            {
                label: '表',
                children: [
                    { label: 'table_user', type: 'table', id: 'ods_user' }
                ]
            },
            {
                label: '存储过程',
                children: [
                    { label: 'proc_clean_user', type: 'procedure', id: 'proc_ods_clean_user' }
                ]
            }
        ]
    },
    {
        label: 'schema_dwd',
        children: [
            {
                label: '表',
                children: [
                    { label: 'table_user_info', type: 'table', id: 'dwd_user_info' }
                ]
            },
            {
                label: '存储过程',
                children: [
                    { label: 'proc_etl_user_info', type: 'procedure', id: 'proc_dwd_user_info' }
                ]
            }
        ]
    }
]

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
    width: 300px;
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