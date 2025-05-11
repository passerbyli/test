<template>
    <div class="schema-tree-layout">
        <div class="left-panel" :style="{ width: leftWidth + 'px' }" ref="leftPanelRef">
            <el-input v-model="filterText" placeholder="搜索表或存储过程..." @input="filterNode" />
            <el-tree :data="treeData" :props="defaultProps" node-key="id" :filter-node-method="filterMethod"
                ref="treeRef" @node-click="handleNodeClick" highlight-current />
        </div>

        <!-- 拖动条 -->
        <div class="resizer" @mousedown="startDragging"></div>

        <div class="right-panel">
            <div>
                <p>请选择表或存储过程查看详情</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElInput, ElTree } from 'element-plus'

const filterText = ref('')
const treeRef = ref()

let treeData = ref([])
onMounted(() => {

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