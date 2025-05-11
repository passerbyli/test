<template>
    <div class="table-asset-overview">
        <!-- 顶部筛选栏 -->
        <div class="filter-bar">
            <el-input v-model="searchText" placeholder="搜索表名或别名" clearable class="filter-input" />

            <el-select v-model="selectedDb" placeholder="数据库" clearable class="filter-select">
                <el-option v-for="db in dbList" :key="db" :label="db" :value="db" />
            </el-select>

            <el-select v-model="selectedSchema" placeholder="Schema" clearable class="filter-select">
                <el-option v-for="schema in schemaList" :key="schema" :label="schema" :value="schema" />
            </el-select>

            <el-select v-model="selectedLayer" placeholder="分层" clearable class="filter-select">
                <el-option v-for="layer in layers" :key="layer" :label="layer" :value="layer" />
            </el-select>

            <el-select v-model="selectedOwner" placeholder="负责人" clearable class="filter-select">
                <el-option v-for="owner in owners" :key="owner" :label="owner" :value="owner" />
            </el-select>

            <el-select v-model="selectedTag" placeholder="标签" clearable class="filter-select">
                <el-option v-for="tag in tags" :key="tag" :label="tag" :value="tag" />
            </el-select>
        </div>

        <!-- 表格区域 -->
        <el-table :data="filteredTables" stripe border size="small">
            <el-table-column prop="table_name" label="表名" width="180" />
            <el-table-column prop="table_alias" label="中文名" width="180" />
            <el-table-column prop="database" label="数据库" width="120" />
            <el-table-column prop="schema" label="Schema" width="120" />
            <el-table-column prop="table_layer" label="分层" width="100" />
            <el-table-column prop="owner" label="负责人" width="100" />
            <el-table-column prop="tags" label="标签" width="180">
                <template #default="{ row }">
                    <el-tag v-for="tag in row.tags" :key="tag" class="tag" size="small" type="info">
                        {{ tag }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="score" label="评分" width="120">
                <template #default="{ row }">
                    <el-rate :model-value="row.score" disabled show-score />
                </template>
            </el-table-column>
            <el-table-column prop="data_volume" label="数据量（行）" width="140" />
            <el-table-column label="操作" fixed="right" width="140">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="viewLineage(row)">
                        血缘分析
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 模拟数据
const dbList = ['db1', 'db2']
const schemaList = ['public', 'analytics']
const layers = ['ODS', 'DWD', 'DWS', 'ADS']
const owners = ['张三', '李四']
const tags = ['核心', '实时', '临时']

const searchText = ref('')
const selectedDb = ref('')
const selectedSchema = ref('')
const selectedLayer = ref('')
const selectedOwner = ref('')
const selectedTag = ref('')

const tables = ref([
    {
        table_name: 'user_info',
        table_alias: '用户信息表',
        database: 'db1',
        schema: 'public',
        table_layer: 'DWD',
        owner: '张三',
        tags: ['核心'],
        score: 4.8,
        data_volume: 120000,
    },
    {
        table_name: 'order_stat',
        table_alias: '订单统计',
        database: 'db2',
        schema: 'analytics',
        table_layer: 'DWS',
        owner: '李四',
        tags: ['历史', '核心'],
        score: 4.2,
        data_volume: 234567,
    },
])

const filteredTables = computed(() => {
    return tables.value.filter((table) => {
        const matchText =
            !searchText.value ||
            table.table_name.includes(searchText.value) ||
            table.table_alias.includes(searchText.value)

        const matchDb = !selectedDb.value || table.database === selectedDb.value
        const matchSchema = !selectedSchema.value || table.schema === selectedSchema.value
        const matchLayer = !selectedLayer.value || table.table_layer === selectedLayer.value
        const matchOwner = !selectedOwner.value || table.owner === selectedOwner.value
        const matchTag = !selectedTag.value || table.tags.includes(selectedTag.value)

        return matchText && matchDb && matchSchema && matchLayer && matchOwner && matchTag
    })
})

const viewLineage = (row) => {
    console.log('血缘分析:', row)
    // TODO: 跳转血缘图页面或弹窗
}
</script>

<style scoped>
.table-asset-overview {
    padding: 20px;
}

.filter-bar {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.filter-input {
    width: 200px;
}

.filter-select {
    width: 140px;
}

.tag {
    margin-right: 4px;
}
</style>