<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header-lf"></div>
        <div class="header-ri">
          <div class="tool-bar-ri">
            <span class="username">zhangshan</span>
            <el-button @click="openLoginWin()">注销</el-button>
            <el-button>最小化</el-button>
            <router-link to="/setting">设置</router-link>
          </div>
        </div>
      </el-header>
      <el-container class="classic-content">
        <el-aside width="200px">
          <el-menu class="el-menu-vertical-demo" router>
            <el-menu-item index="/" :class="$route.path === '/' ? 'is-active' : ''">
              <span>Home</span>
            </el-menu-item>
            <template v-for="(item, index) in menuRoutes">
              <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
                <template #title>
                  <span>{{ item.meta.title }}</span>
                </template>
                <el-menu-item v-for="(child, childIndex) in item.children" :key="childIndex" :index="child.path">
                  <span>{{ child.meta.title }}</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="item.path" :class="$route.path === item.path ? 'is-active' : ''">
                <span>{{ item.meta.title }}</span>
              </el-menu-item>

            </template>
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
import { computed, ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'


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

const routes = useRouter().getRoutes()

const menuRoutes = computed(() => {
  const adjustedRoutes = routes.flatMap(route => {
    if (route.path === '/' && route.children) {
      return route.children.map((child) => ({
        ...child,
        path: child.path,
        meta: child.meta
      }))
    }
    if (route.meta?.hidden) {
      return []
    }
    return route
  })

  return adjustedRoutes
})

const dialogVisible = ref(false)

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