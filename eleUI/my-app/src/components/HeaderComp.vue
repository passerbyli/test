<template>
    <el-header class="header">
        <div class="title">{{ appName }} - v{{ version }}</div>
        <div class="actions">
            <el-button type="text">设置</el-button>
            <el-button type="text">登录</el-button>
            <el-button type="text">退出</el-button>
        </div>
    </el-header>
</template>

<script>
export default {
    data() {
        return {
            appName: "加载中...",
            version: "加载中...",
        };
    },
    async created() {
        if (window.electron) {
            const config = await window.electron.invoke("get-app-config");
            this.appName = config.appName;
            this.version = config.version;
        } else {
            console.error("Electron API 未定义！");
        }
    },
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: #409eff;
    color: white;
    font-size: 18px;
}

.actions {
    display: flex;
    gap: 10px;
}
</style>