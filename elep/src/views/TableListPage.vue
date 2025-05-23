<template>
    <el-card>
        <!-- 搜索和筛选区 -->
        <el-form :inline="true" :model="filters" class="mb-4">
            <el-form-item label="关键词">
                <el-input v-model="filters.keyword" placeholder="表名 / 描述" clearable />
            </el-form-item>
            <el-form-item label="数据库">
                <el-select v-model="filters.dataSource" placeholder="全部" clearable>
                    <el-option v-for="item in optionLists.dataSources" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="Schema">
                <el-select v-model="filters.schema" placeholder="全部" clearable>
                    <el-option v-for="item in optionLists.schemas" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="分层">
                <el-select v-model="filters.layer" placeholder="全部" clearable>
                    <el-option v-for="item in optionLists.layers" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="loadTables">搜索</el-button>
                <el-button @click="resetFilters">重置</el-button>
                <el-button type="success" @click="exportAll" :disabled="tableList.length === 0">导出</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格列表 -->
        <el-table :data="tableList" style="width: 100%" v-loading="loading">
            <el-table-column prop="table_name" label="表名" />
            <el-table-column prop="schema_name" label="Schema" />
            <el-table-column prop="layer" label="分层" />
            <el-table-column prop="type" label="类型" />
            <el-table-column prop="description" label="描述" />
            <el-table-column width="100">
                <template #default="scope">
                    <el-button type="primary" link @click="viewDetail(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="text-right mt-4">
            <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
                :total="pagination.total" layout="prev, pager, next, jumper" @current-change="loadTables" />
        </div>
    </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const filters = reactive({ keyword: '', dataSource: '', schema: '', layer: '' })
const optionLists = reactive({ dataSources: [], schemas: [], layers: [] })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const tableList = ref([])

const loadOptions = async () => {
    const res = await window.dbAPI.tableDistinctOptions()
    optionLists.dataSources = res.dataSources
    optionLists.schemas = res.schemas
    optionLists.layers = res.layers
}

const loadTables = async () => {
    loading.value = true
    try {
        const res = await window.dbAPI.tableQueryAll({
            filters,
            page: pagination.page,
            pageSize: pagination.pageSize
        })
        // tableList.value = res.data
        // pagination.total = res.total
    } catch (e) {
        ElMessage.error('加载失败',e)
    } finally {
        loading.value = false
    }
}

const resetFilters = () => {
    filters.keyword = ''
    filters.dataSource = ''
    filters.schema = ''
    filters.layer = ''
    pagination.page = 1
    loadTables()
}

const viewDetail = (row) => {
    router.push({ name: 'table-detail', params: { id: row.uuid } })
}

const exportAll = async () => {
    const result = await window.dbAPI.exportToFile({ ...filters })
    if (result) {
        ElMessage.success('导出成功：' + result)
    } else {
        ElMessage.warning('取消导出')
    }
}

onMounted(() => {
    loadOptions()
    loadTables()
})
</script>

<style scoped>
.mb-4 {
    margin-bottom: 16px;
}

.mt-4 {
    margin-top: 16px;
}
</style>