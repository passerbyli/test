<template>
    <div>
        <h2>应用介绍</h2>
        <el-button @click="openFolder('logs')">打开日志文件夹</el-button>
        <el-button @click="openFolder('config')">打开配置文件夹</el-button>
    </div>
</template>

<script>
export default {
    methods: {
        openFolder(type) {
            console.log(`打开 ${type} 文件夹`);
            window.electron.invoke("open-folder");
        },
    },
};
</script>