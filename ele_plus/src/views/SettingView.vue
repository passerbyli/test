<template>
  <div class="action-bar" style="">
    <el-button type="primary" @click="onSubmit">确定</el-button>
  </div>
  <el-container class="contttt">
    <el-form :model="form" label-width="auto" label-position="top">
      <h2>数据库设置</h2>
      <div class="module_database">
        <el-row gutter="24">
          <el-col :span="4">数据源</el-col>
          <el-col :span="4">host</el-col>
          <el-col :span="4">port</el-col>
          <el-col :span="4">database</el-col>
          <el-col :span="4">username</el-col>
          <el-col :span="4">password</el-col>
        </el-row>
        <el-row gutter="20" v-for="database in form.dataBase">
          <el-col :span="4">{{ database.type }}
          </el-col>
          <el-col :span="4">
            <el-input v-model="database.host" />
          </el-col>
          <el-col :span="4">
            <el-input v-model="database.port" />
          </el-col>
          <el-col :span="4">
            <el-input v-model="database.schema" />
          </el-col>
          <el-col :span="4">
            <el-input v-model="database.user" />
          </el-col>
          <el-col :span="4">
            <el-input v-model="database.password" />
          </el-col>
        </el-row>
      </div>
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
        dataBase: [{
          type: 'mysql',
          host: 'localhost',
          user: 'root',
          password: 'admin2312',
          database: 'database',
          port: 3306,
          timezone: '+08:00',
        }, {
          type: 'pgsql',
          host: 'localhost',
          user: 'root',
          password: 'admin2312',
          database: 'database',
          port: 3306,
          timezone: '+08:00',
        }],
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

<style lang="scss" scoped>
.module_database {
  .el-row {
    padding: 10px 0px;
    border-bottom: 1px solid #ccc;
  }
}

.contttt {
  height: calc(100% - 40px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
