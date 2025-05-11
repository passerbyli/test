<template>
    <div class="p-4">
        <el-card>
            <div class="flex justify-between items-center mb-4">
                <span class="text-xl font-bold">数据源管理</span>
                <el-button type="primary" @click="openAddDialog">添加数据源</el-button>
            </div>

            <el-table :data="dataSources" style="width: 100%">
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="host" label="地址" />
                <el-table-column label="激活">
                    <template #default="{ row }">
                        <el-radio v-model="activeId" :label="row.id" @change="setActive(row.id)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template #default="{ row }">
                        <el-button size="small" @click="editRow(row)">编辑</el-button>
                        <el-button size="small" type="success" @click="testConnection(row)">测试</el-button>
                        <el-button size="small" type="danger" @click="deleteRow(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <DataSourceForm v-model:visible="dialogVisible" :formData="currentForm" @submit="saveDataSource" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import DataSourceForm from '../components/DataSourceForm.vue';


const dataSources = ref([]);
const activeId = ref('');
const dialogVisible = ref(false);
const currentForm = ref(null);

const loadData = async () => {
};

const openAddDialog = () => {
    currentForm.value = null;
    dialogVisible.value = true;
};

const editRow = (row) => {
    currentForm.value = { ...row };
    dialogVisible.value = true;
};

const saveDataSource = async (form) => {
    dialogVisible.value = false;
    loadData();
};

const deleteRow = async (id) => {
    await ElMessageBox.confirm('确认删除该数据源？', '警告');
    loadData();
};

const setActive = async (id) => {
    ElMessage.success('已设为激活数据源');
};

const testConnection = async (row) => {
};

onMounted(loadData);
</script>