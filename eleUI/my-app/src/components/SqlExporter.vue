<template>
    <el-card>
        <h2>导出 SQL</h2>
        <el-input v-model="queryId" placeholder="输入 ID"></el-input>
        <el-button @click="exportSql">导出</el-button>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            queryId: "",
        };
    },
    methods: {
        exportSql() {
            console.log("导出 SQL", this.queryId);
        },
    },
};
</script>