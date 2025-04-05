<template>
    <div class="log-viewer">
        <h2>日志查看</h2>
        <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" format="YYYY-MM-DD" @change="loadLog" />
        <el-button @click="loadLog" style="margin-left: 10px">刷新</el-button>

        <el-alert v-if="error" type="error" :closable="false" :title="error" />

        <el-scrollbar class="log-box">
            <pre>{{ logContent }}</pre>
        </el-scrollbar>
    </div>
</template>

<script setup>
import { ref } from 'vue'


const selectedDate = ref(new Date())
const logContent = ref('')
const error = ref('')

const formatDate = (date) => {
    return date.toISOString().split('T')[0]
}

const loadLog = async () => {
    error.value = ''
    logContent.value = ''
    const dateStr = formatDate(selectedDate.value)

    if (window.ipc) {
        await window.ipc.sendInvoke('toMain', { event: 'read-log', params: dateStr }).then(res => {

            if (res.success) {
                logContent.value = res.content
            } else {
                error.value = res.message || '无法读取日志'
            }
        })

    }

}

// 初始加载
loadLog()
</script>

<style scoped>
.log-viewer {
    padding: 20px;
}

.log-box {
    background: #111;
    color: #0f0;
    font-family: monospace;
    font-size: 13px;
    padding: 10px;
    margin-top: 20px;
    height: 500px;
    overflow-y: auto;
    border-radius: 4px;
    border: 1px solid #333;
}
</style>