<template>
  <main>
    <h1>Home</h1>
    <p>Welcome to the home page!</p>
    <p><el-button type="" @click="open()">我的配置文件夹</el-button></p>
  </main>
</template>

<script>
import { defineComponent, onMounted, toRefs, reactive } from 'vue'
export default defineComponent({
  name: 'HomeView',
  setup(props, context) {
    onMounted(() => {
      window.ipc.sendInvoke('toMain', { event: 'getMessage' }).then((res) => {
        console.log('=----', res)
      })
      console.log('HomeView mounted')
    })

    const dataMap = reactive({
      open() {
        window.ipc.sendInvoke('toMain', { event: 'startBid' }, (res) => {
          console.log(res)
        })
      }
    })
    return {
      ...toRefs(dataMap)
    }
  }
})
</script>
