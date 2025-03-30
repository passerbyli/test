<template>
    <div class="action-bar">
        <el-button type="primary" @click="onSubmit">确定</el-button>
    </div>
    <el-container>
        <el-form :model="form" label-width="auto" label-position="top">
            <el-form-item label="Host">
                <el-input v-model="form.dataBase.url" />
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="form.dataBase.user" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.dataBase.password" />
            </el-form-item>
            <el-form-item label="端口号">
                <el-input v-model="form.dataBase.port" />
            </el-form-item>
            <el-form-item label="数据库">
                <el-select v-model="form.dataBase.schema" placeholder="请选择">
                    <el-option label="mysql" value="mysql" />
                    <el-option label="database1" value="database1" />
                    <el-option label="database2" value="database2" />
                </el-select>
            </el-form-item>
            <el-form-item label="时区">
                <el-input v-model="form.dataBase.timezone" />
            </el-form-item>
            <el-form-item label="是否开启提醒">
                <el-switch v-model="form.isNote" />
            </el-form-item>
        </el-form>
    </el-container>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue'


export default defineComponent({
    name: 'SettingView',
    setup(props, context) {
        onMounted(() => {
            if (window.ipc) {
                window.ipc.sendInvoke('toMain', { event: 'getUserDataProperty', params: 'settings' }).then((res) => {
                    if (res) {
                        dataMap.form = res
                    }
                })
            }
        });
        const dataMap = reactive({
            form: {
                dataBase: {
                    host: '',
                    user: '',
                    password: '',
                    database: 'database1',
                    port: 3306,
                    timezone: '+08:00'
                }, isNote: false
            },
            dialogVisible: false,
            onSubmit() {
                window.ipc.sendInvoke('toMain', {
                    event: 'setUserDataJsonProperty',
                    params: {
                        key: "settings",
                        value: JSON.stringify(dataMap.form)
                    }
                }).then((res) => {
                    window.ipc.sendInvoke('toMain', { event: 'getUserDataProperty', params: 'settings' }).then((res) => {
                        console.log(res)
                    })
                })
            },
        })
        return {
            ...toRefs(dataMap)
        }
    }
})



</script>

<style scoped></style>
