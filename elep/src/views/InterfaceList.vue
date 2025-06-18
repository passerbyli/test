<template>
    <div class="p-4 space-y-4">
        <!-- Search & Filter -->
        <el-form :inline="true" :model="filters" @keyup.enter="handleSearch">
            <el-form-item label="接口名称">
                <el-input v-model="filters.name" placeholder="模糊搜索" clearable />
            </el-form-item>
            <el-form-item label="接口地址">
                <el-input v-model="filters.url" placeholder="模糊搜索" clearable />
            </el-form-item>
            <el-form-item label="实现">
                <el-select v-model="filters.impl" placeholder="全部" clearable>
                    <el-option label="Java" value="java" />
                    <el-option label=".NET Core" value="netCore" />
                </el-select>
            </el-form-item>
            <el-form-item label="领域">
                <el-select v-model="filters.domain" placeholder="全部" clearable>
                    <el-option v-for="d in domains" :key="d" :label="d" :value="d" />
                </el-select>
            </el-form-item>
            <el-form-item label="认证类型">
                <el-select v-model="filters.authType" placeholder="全部" clearable>
                    <el-option v-for="a in authTypes" :key="a" :label="a" :value="a" />
                </el-select>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="filters.desc" placeholder="描述关键词" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetFilters">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- List -->
        <el-table :data="data" height="calc(100vh-260px)" @row-dblclick="toDetail">
            <el-table-column prop="name" label="接口名称" min-width="180" />
            <el-table-column prop="url" label="地址" min-width="240" />
            <el-table-column prop="impl" label="实现" width="100" />
            <el-table-column prop="domain" label="领域" width="120" />
            <el-table-column prop="authType" label="认证类型" width="120" />
            <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip />
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getInterfaceList, getDomainList, getAuthTypes, diffApiByRoute } from '@/services/interfaceApi'
import { useRouter } from 'vue-router'

const router = useRouter()
const filters = ref({ name: '', url: '', impl: '', domain: '', authType: '', desc: '' })
const data = ref([])
const domains = ref([])
const authTypes = ref([])

async function fetchList() {
    let ccc = await diffApiByRoute('route-1001')
    console.log(ccc)
    data.value = await getInterfaceList(filters.value)
}

function handleSearch() {
    fetchList()
}

function resetFilters() {
    filters.value = { name: '', url: '', impl: '', domain: '', authType: '', desc: '' }
    fetchList()
}

function toDetail(row) {
    router.push({ name: 'InterfaceDetail', params: { id: row.id } })
}

onMounted(async () => {
    domains.value = await getDomainList()
    authTypes.value = await getAuthTypes()
    fetchList()
})
</script>

<style scoped>
/* minimal styling */
</style>