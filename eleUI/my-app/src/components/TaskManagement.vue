<template>
    <div class="task-management">
        <h2>任务管理</h2>
        <div class="actions">
            <el-button type="primary" @click="addTask">新增任务</el-button>
            <el-button @click="importTasks">导入任务</el-button>
            <el-button @click="exportTasks">导出任务</el-button>
        </div>
        <el-table :data="tasks" style="width: 100%; margin-top: 20px">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="title" label="任务标题"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" @click="editTask(scope.row)">编辑</el-button>
                    <el-button size="mini" type="warning" @click="notifyTask(scope.row)">提醒</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tasks: [] // 后续可通过 ipc 调用后端 MySQL 获取数据
        };
    },
    methods: {
        addTask() {
            // 这里弹出对话框新增任务，或跳转到任务编辑页
            this.$message.info("新增任务功能待实现");
        },
        editTask(task) {
            this.$message.info(`编辑任务：${task.title}`);
        },
        notifyTask(task) {
            // window.electronAPI.showNotification(`任务【${task.title}】需要注意！`);
        },
        importTasks() {
            this.$message.info("导入任务功能待实现");
        },
        exportTasks() {
            this.$message.info("导出任务功能待实现");
        }
    },
    created() {
        // // 示例：可以通过 ipc 调用查询任务数据（集成 MySQL 查询）
        // window.electronAPI.queryTasks("关键字").then(data => {
        //     this.tasks = data;
        // });
    }
};
</script>

<style scoped>
.task-management {
    padding: 20px;
}

.actions>.el-button {
    margin-right: 10px;
}
</style>