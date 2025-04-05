<template>
    <el-form @submit.prevent="handleLogin">
        <el-form-item label="用户名">
            <el-input v-model="username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input type="password" v-model="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { writeConfig } from '../utils/fileUtils';

export default {
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        handleLogin() {
            const loginInfo = {
                username: this.username,
                password: this.password
            };

            // 保存登录信息到 config.json
            const config = {
                login: loginInfo,
                settings: this.$store.state.settings
            };
            writeConfig(config);

            // 更新 Vuex 状态
            this.$store.dispatch('login', this.username);

            // 跳转到首页
            this.$router.push('/');
        }
    }
};
</script>