<script setup>
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'


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

</script>

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
          <el-menu v-for="(item, index) in routes" router>
            <el-menu-item :index="item.path" :class="$route.path === item.path ? 'is-active' : ''">
              <span>{{ item.meta.title }}</span>
            </el-menu-item>
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
      xxxx
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

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