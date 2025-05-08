<template>
    <el-dialog v-model="visible" title="数据源配置" width="500">
        <el-form :model="form" label-width="100">
            <el-form-item label="名称">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="form.type">
                    <el-option label="PostgreSQL" value="pgsql" />
                    <el-option label="MySQL" value="mysql" />
                </el-select>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="form.host" />
            </el-form-item>
            <el-form-item label="端口">
                <el-input v-model="form.port" />
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="form.user" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" type="password" />
            </el-form-item>
            <el-form-item label="数据库">
                <el-input v-model="form.database" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps(['formData']);
const emit = defineEmits(['submit', 'update:visible']);

const visible = defineModel('visible');
const form = reactive({
    id: '',
    name: '',
    type: '',
    host: '',
    port: '',
    user: '',
    password: '',
    database: ''
});

watch(() => props.formData, (val) => {
    Object.assign(form, val || {
        id: crypto.randomUUID(),
        name: '',
        type: '',
        host: '',
        port: '',
        user: '',
        password: '',
        database: ''
    });
}, { immediate: true });

const submit = () => {
    emit('submit', { ...form });
};
</script>