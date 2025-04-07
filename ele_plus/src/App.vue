<template>
  <div class="common-layout">
    <el-container>
      <el-header class="cus_header header-flex">
        <div class=" header-lf">
        </div>
        <div class="operate-setting">
          <div v-if="isLogin">
            <span class="username">[{{ userinfo?.role }}]{{ userinfo?.username }}</span>
            <el-button type="primary" plain @click="openLoginWin()">注销</el-button>
          </div>
          <div v-else>
            <el-button type="primary" plain @click="openLoginWin()">登录</el-button>
          </div>

          <el-tooltip class="box-item" content="设置" placement="top">
            <el-icon class="sys-setting" @click="redirectSetting">
              <Setting />
            </el-icon>
          </el-tooltip>

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
        </el-container>
      </el-container>

      <el-footer class="cus_footer classic-footer">Footer</el-footer>
    </el-container>
    <el-dialog v-model="dialogVisible" title="登录" draggable show-close='false' close-on-press-escape="false"
      close-on-click-modal="false">
      <el-form :model="form" label-width="auto">
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择">
            <el-option label="开发" value="开发" />
            <el-option label="测试" value="测试" />
            <el-option label="SM" value="SM" />
          </el-select>

        </el-form-item>
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
import { Setting, Avatar, CaretBottom } from '@element-plus/icons-vue'
import { computed, ref, onMounted, unref } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'

import MenuItem from './MenuItem.vue' // 递归组件

const buttonRef = ref()
const popoverRef = ref()

onMounted(() => {
  if (window.ipc) {
    window.ipc.receive('fromMain', (data) => {
      if (data && data.event) {
        if (data.event === 'console') {
          console.log('%c助手：', 'color:#fff;font-size:14px', data.data)
        } else if (data.event == 'openLoginWin') {
          dialogVisible.value = true
          userinfo.value = {}
          isLogin.value = false
        }
      }
    })
    window.ipc.sendInvoke("toMain", { event: "init" }).then(res => {
      isLogin.value = true
      userinfo.value = res
    })
    // setInterval(() => {
    //   window.ipc.sendInvoke("toMain", { event: "getUserInfo" }).then(res => {
    //     if (res.type == 'error') {
    //       loginReqError.value = true
    //       loginMsg.value = res.message
    //     } else {
    //       console.log(res.data)
    //       isLogin.value = true
    //       userinfo.value = res.data
    //       dialogVisible.value = false
    //     }
    //   })
    // }, 3000000)

  }
})
const { push } = useRouter()
const redirectSetting = () => {
  push(`/setting`)
}

const openPopover = () => {
  console.log('djaiodjaiso')
  unref(popoverRef).popperRef?.delayHide?.()
}

const router = useRouter()
const route = useRoute()
// 获取当前激活的菜单项
const activeMenu = computed(() => route.path)

// 过滤出有 meta.title 的路由作为菜单显示
const routes = computed(() =>
  router.options.routes.filter((r) => r.meta?.title || (r.children && r.children.length)),
)

const isLogin = ref(false)
const dialogVisible = ref(false)
const loginReqError = ref(false)
const loginMsg = ref('')
const userinfo = ref({
  role: '',
  username: ''
})

const form = ref({
  username: 'admin',
  password: '12345666',
  role: '开发'
})

const openLoginWin = () => {
  dialogVisible.value = true
}


const login = () => {
  if (window.ipc) {
    window.ipc
      .sendInvoke('toMain', {
        event: 'login',
        params: {
          username: form.value.username,
          password: form.value.password,
          role: form.value.role
        },
      })
      .then((res) => {
        console.log('====', res)
        if (res.type == 'error') {
          loginReqError.value = true
          loginMsg.value = res.message
        } else if (res.message == '用户名或密码错误') {
          loginReqError.value = true
          loginMsg.value = res.message
        } else {
          isLogin.value = true
          userinfo.value = res.data
          dialogVisible.value = false
        }
      })
  }
}


</script>
<style lang="scss" scoped>
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


  .classic-content {
    display: flex;
    height: calc(100% - 50px - 40px);
  }

  .classic-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}

.header-flex {
  margin-bottom: 0.5px;
  display: flex;
  align-items: center;
  height: 40px;
  background-color: var(--color-background-base);
  padding: 0 24px;

  .operate-setting {
    margin-left: auto;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }
  }
}

.sys-setting {
  margin: 0 10px 0 0;
  padding: 5px;
  height: 28px;
  width: 28px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
}

.classic-footer {
  height: 40px;
}
</style>
<style lang="scss">
.el-menu-item.is-active {
  background: var(--color-background-base) !important;
  color: #fff;
}
</style>
