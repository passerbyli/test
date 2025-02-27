<template>
    <el-aside width="200px" class="sidebar">
        <el-menu default-active="1" class="el-menu-vertical-demo">
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">任务管理</el-menu-item>
            <el-menu-item index="3">设置</el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script>
export default {
    name: 'SidebarComp'
};
</script>

<style scoped>
.sidebar {
    height: 100%;
    background-color: #f4f4f4;
}
</style>