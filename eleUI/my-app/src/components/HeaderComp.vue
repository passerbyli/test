<template>
    <div class="header-comp">
        <div class="title">{{ config.appName }} v{{ config.version }}1111</div>
        <div class="actions">
            <el-button size="mini" @click="$emit('open-settings')">设置</el-button>
            <el-button size="mini">登录</el-button>
            <el-button size="mini" type="danger">退出</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        config: {
            type: Object,
            default: () => ({ appName: "加载中...", version: "0.0.0" })
        }
    },
    data() {
        return {};
    }
};
</script>

<style scoped>
.header-comp {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
}

.title {
    font-size: 20px;
    font-weight: bold;
}

.actions>.el-button {
    margin-left: 5px;
}
</style>