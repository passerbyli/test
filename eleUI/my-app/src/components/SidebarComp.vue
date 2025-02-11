<template>
    <el-menu :default-active="activeMenu" router>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/task">查询任务</el-menu-item>
        <el-menu-item index="/jsonFormatter">格式化 JSON</el-menu-item>
        <el-menu-item index="/jsonAnalyzer">分析 JSON</el-menu-item>
        <el-menu-item index="/sqlExporter">导出 SQL</el-menu-item>
    </el-menu>
</template>

<script>
export default {
    data() {
        return {
            activeMenu: "/",
        };
    },
};
</script>