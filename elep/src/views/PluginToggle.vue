<template>
    <div style="padding: 20px">
        <el-button type="primary" @click="launchPlugin">
            打开 Chrome 并加载插件
        </el-button>
        <el-alert v-if="msg" :title="msg" type="success" show-icon style="margin-top: 16px" />
    </div>
</template>

<script setup>
import { ref } from 'vue'

const msg = ref('')

async function launchPlugin() {
    await window.electronAPI.invoke('plugin:launch-chrome')
    msg.value = 'Chrome 已启动，请在新页面中点击进入插件页手动启用'
}
</script>