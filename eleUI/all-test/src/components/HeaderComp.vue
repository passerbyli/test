<template>
    <el-header>
        <div class="header-content">
            <span>{{ appName }} - {{ appVersion }}</span>
            <div class="header-actions">
                <el-button v-if="!loggedIn" @click="goToLogin">登录</el-button>
                <el-button v-if="loggedIn" @click="logout">退出</el-button>
                <el-button @click="openSettings">设置</el-button>
            </div>
        </div>
    </el-header>
</template>

<script>
import { appConfig } from '../config';

export default {
    computed: {
        appName() {
            return appConfig.name;
        },
        appVersion() {
            return appConfig.version;
        },
        loggedIn() {
            return this.$store.state.loggedIn;
        }
    },
    methods: {
        goToLogin() {
            if (this.$route.path !== '/login') {
                this.$router.push('/login');
            }
        },
        logout() {
            this.$store.dispatch('logout');
        },
        openSettings() {
            this.$emit('open-settings');
        }
    }
};
</script>