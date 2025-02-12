<template>
    <el-menu :default-active="$route.path" class="sidebar-menu" router>
        <el-menu-item index="/">
            <i class="el-icon-house"></i>
            <span slot="title">首页1</span>
        </el-menu-item>
        <el-menu-item index="/tasks">
            <i class="el-icon-tickets"></i>
            <span slot="title">任务管理</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
export default {
    name: "SidebarComp"
};
</script>

<style scoped>
.sidebar-menu {
    height: 100%;
    border-right: none;
}
</style>