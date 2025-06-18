<template>
    <div class="p-6 space-y-6">
        <el-page-header @back="$router.back()" content="接口详情" />

        <!-- 环境切换 -->
        <el-radio-group v-model="env" @change="fetchDetail">
            <el-radio-button label="prod">生产</el-radio-button>
            <el-radio-button label="test">测试</el-radio-button>
        </el-radio-group>

        <!-- 基础信息 -->
        <el-descriptions v-if="detail" :title="detail.name" :column="2">
            <el-descriptions-item label="接口ID">{{ detail.id }}</el-descriptions-item>
            <el-descriptions-item label="API ID">{{ detail.apiId }}</el-descriptions-item>
            <el-descriptions-item label="地址">
                <span :class="diffClass('url')">{{ detail.url }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="线上地址">
                <span :class="diffClass('onlineUrl')">{{ detail.onlineUrl }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="实现">
                <span :class="diffClass('impl')">{{ detail.impl }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="领域">
                <span :class="diffClass('domain')">{{ detail.domain }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="认证类型">
                <span :class="diffClass('authType')">{{ detail.authType }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="描述" :span="2">
                <span :class="diffClass('description')">{{ detail.description }}</span>
            </el-descriptions-item>
        </el-descriptions>

        <!-- 请求示例 -->
        <el-card v-if="detail && detail.requestExample" header="请求示例">
            <el-input type="textarea" :rows="4" v-model="detail.requestExample" readonly />
        </el-card>

        <!-- 入参定义 -->
        <el-card v-if="detail && detail.inputParams?.length" header="入参定义">
            <el-table :data="detail.inputParams" border>
                <el-table-column prop="name" label="字段名" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="required" label="必填" width="80" />
                <el-table-column prop="desc" label="描述" />
            </el-table>
        </el-card>

        <!-- 出参定义 -->
        <el-card v-if="detail && detail.outputParams?.length" header="出参定义">
            <el-table :data="detail.outputParams" border>
                <el-table-column prop="name" label="字段名" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="desc" label="描述" />
            </el-table>
        </el-card>

        <!-- 后端脚本 -->
        <el-card v-if="detail && detail.backendScript" header="后端脚本">
            <el-input type="textarea" :rows="6" v-model="detail.backendScript" readonly />
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getInterfaceDetail } from '@/services/interfaceApi'

const route = useRoute()
const id = Number(route.params.id)
const env = ref('prod')
const detail = ref(null)
const original = ref({ prod: null, test: null })

// 获取数据
async function fetchDetail() {
    const data = await getInterfaceDetail(id, env.value)
    detail.value = data
    original.value[env.value] = data
}

function diffClass(field) {
    const otherEnv = env.value === 'prod' ? 'test' : 'prod'
    const cur = original.value[env.value]?.[field]
    const other = original.value[otherEnv]?.[field]
    if (cur != null && other != null && cur !== other) {
        return 'text-red-500 font-bold'
    }
    return ''
}

onMounted(async () => {
    await fetchDetail()
    await getInterfaceDetail(id, env.value === 'prod' ? 'test' : 'prod')
        .then(d => (original.value[env.value === 'prod' ? 'test' : 'prod'] = d))
})
</script>

<style scoped>
.text-red-500 {
    color: #f56c6c;
}
</style>