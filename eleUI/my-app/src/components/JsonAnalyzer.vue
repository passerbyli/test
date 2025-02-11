<template>
    <el-card>
        <h2>分析 JSON</h2>
        <el-upload action="#" :before-upload="handleUpload">
            <el-button>上传 JSON 文件</el-button>
        </el-upload>
    </el-card>
</template>

<script>
export default {
    methods: {
        handleUpload(file) {
            console.log("上传文件", file);
            return false;
        },
    },
};
</script>