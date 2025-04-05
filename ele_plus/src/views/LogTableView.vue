<template>
    <div class="log-table-viewer">
        <h2>日志查看（表格 + 过滤 + 出入参）</h2>

        <div style="margin-bottom: 10px">
            <el-date-picker v-model="selectedDate" type="date" format="YYYY-MM-DD" @change="loadData" />
            <el-button @click="loadData" style="margin-left: 10px">刷新</el-button>

            <el-input v-model="keyword" placeholder="关键词过滤（URL、标签、错误）" style="margin-left: 20px; width: 300px"
                clearable />
        </div>

        <el-table :data="filteredLogs" height="600px" border stripe row-key="time">
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="tag" label="标签" width="150" />
            <el-table-column prop="method" label="方法" width="80" />
            <el-table-column prop="url" label="URL" />
            <el-table-column prop="status" label="状态码" width="100" />
            <el-table-column prop="duration" label="耗时" width="100" />
            <el-table-column prop="error" label="错误信息" />

            <!-- 展开行：出入参 -->
            <template #expand="{ row }">
                <div class="log-detail">
                    <strong>Params:</strong>
                    <pre>{{ row.params || '-' }}</pre>
                    <strong>Data:</strong>
                    <pre>{{ row.requestData || '-' }}</pre>
                    <strong>Response:</strong>
                    <pre>{{ row.responseData || '-' }}</pre>
                </div>
            </template>
        </el-table>

        <el-alert v-if="error" type="error" :closable="false" :title="error" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedDate = ref(new Date())
const logList = ref([])
const error = ref('')
const keyword = ref('')

const formatDate = (date) => date.toISOString().split('T')[0]

const loadData = async () => {
    error.value = ''
    logList.value = []
    if (window.ipc) {
        await window.ipc.sendInvoke('toMain', { event: 'read-log-table', params: formatDate(selectedDate.value) }).then(res => {

            // const res = await ipcRenderer.invoke('read-log-table', formatDate(selectedDate.value))
            if (res.success) {
                logList.value = res.data
            } else {
                error.value = res.message
            }
        })
    }
}


// 搜索过滤（模糊匹配）
const filteredLogs = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    if (!kw) return logList.value

    return logList.value.filter(log =>
        log.url?.toLowerCase().includes(kw) ||
        log.tag?.toLowerCase().includes(kw) ||
        log.error?.toLowerCase().includes(kw)
    )
})

loadData()
</script>

<style scoped>
.log-table-viewer {
    padding: 20px;
}

.log-detail {
    background: #f7f7f7;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    border: 1px dashed #ccc;
}

pre {
    margin: 5px 0;
    white-space: pre-wrap;
    word-break: break-all;
}
</style>