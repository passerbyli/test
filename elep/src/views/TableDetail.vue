<template>
    <el-card class="procedure-detail p-4">
        <template #header>
            <div class="card-header">
                <span>{{ tableName }}- {{procName}}</span>
                <el-button type="primary" @click="goBack">返回</el-button>
            </div>
        </template>

        <el-tabs v-model="activeTab">
            <!-- Tab1：表结构 -->
            <el-tab-pane label="表结构" name="structure">
                <el-tabs v-model="activeStructureTab" tab-position="top">
                    <el-tab-pane label="字段信息" name="fields">
                        <el-table :data="fields" border>
                            <el-table-column prop="name" label="字段名" />
                            <el-table-column prop="type" label="类型" />
                            <el-table-column prop="nullable" label="是否可为空" />
                            <el-table-column prop="default" label="默认值" />
                            <el-table-column prop="comment" label="备注" />
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="建表语句" name="ddl">
                        <CopyableTextarea :content="createTableSql" label="建表语句" height="280px" />
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>

            <!-- Tab2：数据预览 -->
            <el-tab-pane label="数据预览" name="preview">
                <el-table :data="sampleData" border>
                    <el-table-column v-for="(col, index) in sampleColumns" :key="index" :prop="col" :label="col" />
                </el-table>
            </el-tab-pane>

            <!-- Tab3：血缘关系 -->
            <el-tab-pane label="血缘关系" name="lineage">
                <!-- 这里可以嵌入 G6 图组件 -->
                <div class="text-gray-500">[血缘图展示组件]</div>
            </el-tab-pane>

            <!-- Tab4：版本变化 -->
            <el-tab-pane label="版本变化" name="version">
                <el-table :data="versions" border @selection-change="onSelectionChange" ref="versionTable">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="version" label="版本号" />
                    <el-table-column prop="timestamp" label="变更时间" />
                    <el-table-column prop="description" label="描述" />
                </el-table>

                <el-button class="mt-4" type="primary" :disabled="selectedVersions.length !== 2"
                    @click="compareSelectedVersions">
                    对比选中版本
                </el-button>

                <el-dialog v-model="diffVisible" title="版本对比" width="90%">
                    <VersionDiff :oldText="selectedVersions[0]?.ddl || ''" :newText="selectedVersions[1]?.ddl || ''"
                        :leftTitle="selectedVersions[0]?.version || '旧版本'"
                        :rightTitle="selectedVersions[1]?.version || '新版本'" />
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'


import { useRoute, useRouter } from 'vue-router'
import VersionDiff from '../components/VersionDiff.vue'
import CopyableTextarea from '../components/CopyableTextarea.vue'
const tableName = ref('user_orders')
const activeTab = ref('structure')
const activeStructureTab = ref('fields')

const route = useRoute()
const router = useRouter()
const procName = route.params.name
const fields = ref([
    { name: 'id', type: 'int', nullable: '否', default: '', comment: '主键' },
    { name: 'user_id', type: 'int', nullable: '否', default: '', comment: '用户ID' },
    { name: 'amount', type: 'decimal(10,2)', nullable: '是', default: '0.00', comment: '订单金额' },
])

const createTableSql = `
  CREATE TABLE user_orders (
    id INT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) DEFAULT 0.00
  );
  `.trim()

const sampleColumns = ['id', 'user_id', 'amount']
const sampleData = [
    { id: 1, user_id: 101, amount: 23.50 },
    { id: 2, user_id: 102, amount: 99.99 },
]


const versions = ref([
    {
        version: 'v1.0',
        timestamp: '2024-01-01',
        description: '初始化版本',
        ddl: `
CREATE TABLE user_orders (
  id INT PRIMARY KEY,
  user_id INT NOT NULL
);`.trim()
    },
    {
        version: 'v1.1',
        timestamp: '2024-02-15',
        description: '新增 amount 字段',
        ddl: `
CREATE TABLE user_orders (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0.00
);`.trim()
    }
])

const selectedVersions = ref([])
const diffVisible = ref(false)

const onSelectionChange = (val) => {
    selectedVersions.value = val
}

const compareSelectedVersions = () => {
    if (selectedVersions.value.length === 2) {
        diffVisible.value = true
    }
}


const goBack = () => router.back()
</script>

<style scoped>
.p-4 {
    padding: 1rem;
}
.procedure-detail {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
}

</style>

<style scoped>
.diff-split {
    display: flex;
    gap: 16px;
}

.diff-block {
    flex: 1;
    background: #f9f9f9;
    border: 1px solid #ddd;
    overflow: auto;
}

.diff-title {
    padding: 8px;
    background: #f0f0f0;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
}

.diff-view {
    font-family: monospace;
    padding: 8px;
    white-space: pre-wrap;
    line-height: 1.6;
}

.line-num {
    display: inline-block;
    width: 2em;
    color: #999;
    text-align: right;
    margin-right: 0.5em;
}

.diff-del {
    background-color: #ffecec;
    color: #d33;
}

.diff-add {
    background-color: #eaffea;
    color: #080;
}
</style>