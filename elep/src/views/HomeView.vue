<template>
  <main>
    <h1>Home</h1>
    <div>
      <el-button type="primary" @click="open('export')">
        <el-icon>
          <FolderOpened />
        </el-icon>我的导出
      </el-button>
    </div>
    <div>
      <el-button type="primary" @click="open('log')">
        <el-icon>
          <FolderOpened />
        </el-icon>查看日志
      </el-button>
    </div>
    <div>
      <el-button type="primary" @click="open('config')">
        <el-icon>
          <FolderOpened />
        </el-icon>我的配置文件夹
      </el-button>
    </div>
    <div>
      <el-button type="primary" @click="openChrome('')">
        <el-icon>
          <FolderOpened />
        </el-icon>打开浏览器
      </el-button>
    </div>
  </main>
</template>

<script>
import { FolderOpened } from '@element-plus/icons-vue'
import { defineComponent, onMounted, toRefs, reactive } from 'vue'
export default defineComponent({
  name: 'HomeView',
  components: {
    FolderOpened,
  },
  setup(props, context) {
    onMounted(() => {

    })
    const dataMap = reactive({
      open(type) {
        window.ipc.sendInvoke('toMain', { event: 'openDirectory', params: { type: type } }, (res) => {
          console.log(res)
        })
      },
      openChrome(type) {
        window.ipc.sendInvoke('toMain', { event: 'openChrome', params: { type: type } }, (res) => {
          console.log(res)
        })
      },
    })

    return {
      ...toRefs(dataMap),
    }
  },
})
</script>

<style></style>
