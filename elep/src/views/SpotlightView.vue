<template>
    <div class="spotlight-wrap" @keydown.esc="close">
        <el-input ref="inputRef" v-model="keyword" placeholder="输入关键词..." size="large" @keyup.enter="onSearch" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const keyword = ref('')
const inputRef = ref()

function onSearch() {
    console.log('搜索指令：', keyword.value)
    // 示例：支持输入 `/open config`、`/help` 等命令
    if (keyword.value.startsWith('/open')) {
        const target = keyword.value.split(' ')[1]
        window.location.href = `/#/${target}`
    }
}

function close() {
    window.close()
}

onMounted(() => {
    inputRef.value.focus()
})
</script>

<style scoped>
.spotlight-wrap {
    padding: 10px 20px;
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
}
</style>