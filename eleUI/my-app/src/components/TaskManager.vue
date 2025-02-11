<template>
    <el-card>
        <h2>待办事项</h2>
        <el-button @click="addTask">新增任务</el-button>
        <el-table :data="tasks">
            <el-table-column prop="title" label="标题" />
            <el-table-column>
                <template slot-scope="scope">
                    <el-button @click="editTask(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            tasks: [{ title: "任务1" }],
        };
    },
    methods: {
        addTask() {
            console.log("新增任务");
        },
        editTask(task) {
            console.log("编辑任务", task);
        },
    },
};
</script>