<template>
    <el-card>
        <h2>格式化 JSON</h2>
        <el-input v-model="jsonText" type="textarea"></el-input>
        <el-button @click="formatJson">格式化</el-button>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            jsonText: "",
        };
    },
    methods: {
        formatJson() {
            try {
                this.jsonText = JSON.stringify(JSON.parse(this.jsonText), null, 2);
            } catch (e) {
                this.$message.error("JSON 格式错误");
            }
        },
    },
};
</script>