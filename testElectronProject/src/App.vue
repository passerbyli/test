<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header-lf"></div>
        <div class="header-ri">
          <div class="tool-bar-ri">
            <div v-if="isLogin">
              <span class="username"></span>
              <el-button @click="openLoginWin()">注销</el-button>
            </div>
            <div v-else>
              <el-button @click="openLoginWin()">登录</el-button>
            </div>
            <el-button :icon="SemiSelect" size="large" circle></el-button>
            <router-link to="/setting"><el-button :icon="Setting" size="large" circle /></router-link>

          </div>
        </div>
      </el-header>
      <el-container class="classic-content">
        <el-aside width="200px">
          <el-menu :default-active="activeMenu" class="el-menu-vertical" background-color="#fff" text-color="#333"
            active-text-color="#409EFF" router>
            <MenuItem v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
          </el-menu>
        </el-aside>
        <el-container class="classic-main">
          <el-main>
            <RouterView />
          </el-main>
          <el-footer class="classic-footer">Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
    <el-dialog v-model="dialogVisible" title="登录" draggable>
      <el-form :model="form" label-width="auto">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-alert v-if="loginReqError" :title="loginMsg" type="error" effect="dark" :closable="false" />
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="login()">登录</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>
<script setup>
import { Setting, SemiSelect } from "@element-plus/icons-vue"
import { computed, ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'

import MenuItem from "./MenuItem.vue"; // 递归组件

onMounted(() => {
  if (window.ipc) {
    window.ipc.receive('fromMain', (data) => {
      if (data && data.event) {
        if (data.event === 'console') {
          console.log('%c助手：', 'color:#fff;font-size:14px', data.data);
        }
      }
    })
  }
})

const router = useRouter();
const route = useRoute();
// 获取当前激活的菜单项
const activeMenu = computed(() => route.path);

// 过滤出有 meta.title 的路由作为菜单显示
const routes = computed(() =>
  router.options.routes.filter((r) => r.meta?.title || (r.children && r.children.length))
);

const isLogin = ref(false)
const dialogVisible = ref(false)
const loginReqError = ref(false)
const loginMsg = ref("")

const openLoginWin = () => {
  dialogVisible.value = true
}

const login = () => {
  if (window.ipc) {
    window.ipc.sendInvoke('toMain', {
      event: 'login',
      params: {
        username: form.value.username,
        password: form.value.password
      }
    }).then((res) => {
      loginReqError.value = true
      loginMsg.value = res.message
      console.log(res)
    })
  }
}

const form = ref({
  username: 'admin',
  password: '123456'
})

</script>
<style scoped>
.common-layout {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}

.el-container {
  width: 100%;
  height: 100%;
}

.classic-content {
  display: flex;
  height: calc(100% - 30px);
}

.classic-main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.classic-footer {
  height: 30px;
}

.el-container .el-header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 55px;
  padding: 0 15px 0 0;
}

.el-container .el-header .header-lf {
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
}

.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
}
</style>