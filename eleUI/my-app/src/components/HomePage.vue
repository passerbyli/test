<template>
    <div class="home-page">
        <h2>欢迎使用桌面管理系统</h2>
        <p>这里显示应用介绍信息……</p>
        <div class="buttons">
            <el-button @click="openFolder('export')">导出目录</el-button>
            <el-button @click="openFolder('logs')">查看日志</el-button>
            <el-button @click="openFolder('config')">查看配置信息</el-button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        openFolder(folderType) {
            console.log(folderType)
            console.log(window.electronAPI);
            // 调用预加载脚本暴露的 `openFolder` 方法
            window.electronAPI.openFolder(folderType).then(result => {
                console.log("打开文件夹成功：", result);
            }).catch(err => {
                console.error("打开文件夹失败：", err);
            });
        }
    }
};
</script>

<style scoped>
.home-page {
    padding: 20px;
}

.buttons>.el-button {
    margin-right: 10px;
}
</style>