<template>
  <div class="action-bar" style="">
    <el-button type="primary" @click="onSubmit">确定</el-button>
  </div>
  <el-container class="contttt">
    <el-form :model="form" label-width="auto" label-position="top">
      <h2>数据库设置</h2>
      <el-row gutter="20">
        <el-col :span="6"><el-form-item label="Host">
            <el-input v-model="form.dataBase.host" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号">
            <el-input v-model="form.dataBase.user" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="密码">
            <el-input v-model="form.dataBase.password" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="端口号">
            <el-input v-model="form.dataBase.port" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="数据库">
            <el-select v-model="form.dataBase.schema" placeholder="请选择">
              <el-option label="mysql" value="mysql" />
              <el-option label="database1" value="database1" />
              <el-option label="database2" value="database2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="时区">
            <el-input v-model="form.dataBase.timezone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider />
      <h2>提醒</h2>
      <el-row gutter="20">
        <el-col :span="6">
          <el-form-item label="是否开启提醒">
            <el-switch v-model="form.pm.reminder" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="事项类型">
            <el-select v-model="form.pm.iteration" placeholder="请选择">
              <el-option label="迭代" value="迭代" />
              <el-option label="PI" value="PI" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider />
      <h2>平台</h2>
      <el-row gutter="50">
        <el-col :span="11">
          <h4>测试环境</h4>
          <el-form-item label="账号">
            <el-input v-model="form.platform.beta.username" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.platform.beta.password" />
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <h4>生产环境</h4>
          <el-form-item label="账号">
            <el-input v-model="form.platform.prod.username" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.platform.prod.password" />
          </el-form-item>
        </el-col>

      </el-row>
      <el-divider />
      <h2>全局</h2>
      <el-row gutter="20">
        <el-col :span="12">
          <el-form-item label="默认文件路径">
            <el-input type="text" v-model="form.config.basePath">
              <template #append>
                <el-button :icon="FolderOpened" @click="selectFolder" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-container>
</template>
<script>
import { FolderOpened } from '@element-plus/icons-vue'
import { defineComponent, reactive, toRefs, onMounted } from 'vue'

export default defineComponent({
  name: 'SettingView',
  setup(props, context) {
    onMounted(() => {
      if (window.ipc) {
        window.ipc
          .sendInvoke('toMain', { event: 'getUserDataProperty', params: 'settings' })
          .then((res) => {
            if (res) {
              dataMap.form = res
            }
          })
      }
    })
    const dataMap = reactive({
      form: {
        dataBase: {
          host: '',
          user: '',
          password: '',
          database: 'database1',
          port: 3306,
          timezone: '+08:00',
        },
        pm: {
          reminder: false,
          iteration: '迭代',
        },
        platform: {
          beta: { username: '', password: "", cookies: [] },
          prod: { username: '', password: "", cookies: [] }
        },
        config: {
          basePath: '',
        },
      },
      dialogVisible: false,
      async selectFolder() {
        if (window.ipc) {
          await window.ipc
            .sendInvoke('toMain', {
              event: 'select-folder',
            })
            .then((result) => {
              if (result) {
                dataMap.form.config.basePath = result[0]
              }
            })
        }
      },
      onSubmit() {
        window.ipc
          .sendInvoke('toMain', {
            event: 'setUserDataJsonProperty',
            params: {
              key: 'settings',
              value: JSON.stringify(dataMap.form),
            },
          })
          .then((res) => {
            window.ipc
              .sendInvoke('toMain', { event: 'getUserDataProperty', params: 'settings' })
              .then((res) => {
                console.log(res)
              })
          })
      },
    })
    return {
      ...toRefs(dataMap),
    }
  },
})
</script>

<style scoped>
.contttt {
  height: calc(100% - 40px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
