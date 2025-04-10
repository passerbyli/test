<template>
    <div id="about">
        <el-row>
            <el-col :span="12">
                数据源：
                <el-select v-model="selectedSouce" placeholder="请选择数据源" @change="loadDataSource" style="width: 200px">
                    <el-option v-for="source in dataSources" :key="source.name" :label="source.name"
                        :value="source.name"></el-option>
                </el-select>
            </el-col>
            <el-col :span="12">
                数据库：
                <el-select v-model="selectedDatabase" placeholder="请选择数据库" @change="loadTablesAndRoutines"
                    style="width: 200px">
                    <el-option v-for="db in databases" :key="db" :label="db" :value="db"></el-option>
                </el-select>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <p>Table</p>
                <el-select v-model="selectedTable" placeholder="请选择数据库" @change="loadTableData" style="width: 200px">
                    <el-option v-for="table in tables" :key="table" :label="table" :value="table"></el-option>
                </el-select>
            </el-col>

            <el-col :span="12">
                <p>Procedure</p>
                <el-select v-model="selectedProcedure" placeholder="请选择数据库" @change="loadProcedureDefinition"
                    style="width: 200px">
                    <el-option v-for="routine in routines" :key="routine" :label="routine.routine_name"
                        :value="routine">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>

        <div v-if="tableData.length">
            <h3>数据</h3>
            <el-table :data="tableData">
                <el-table-column v-for="(header, index) in tableHeaders" :key="index" :label="header" :prop="header" />
            </el-table>
        </div>

        <div v-if="procedureDefinition">
            <h3>存储过程内容</h3>
            <pre>{{ procedureDefinition }}</pre>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, toRefs, reactive } from 'vue'

export default defineComponent({
    setup() {

        // 获取数据库列表
        const getDatasources = async () => {
            await window.ipc.sendInvoke('toMain', { event: 'getDataSources' }).then((res) => {
                dataSources.value = res
            })
        }



        // 获取数据库列表
        const loadDataSource = async (database) => {
            await window.ipc.sendInvoke('toMain', { event: 'getDataBases', params: database }).then((res) => {
                databases.value = res
            })
        }

        // 获取表列表和存储过程列表
        const loadTablesAndRoutines = async () => {
            if (!selectedDatabase.value) return
            await window.ipc
                .sendInvoke('toMain', {
                    event: 'getTables',
                    params: {
                        database: selectedDatabase.value,
                    },
                })
                .then((res) => {

                    tables.value = res
                })
            await window.ipc
                .sendInvoke('toMain', {
                    event: 'getRoutines',
                    params: { database: selectedDatabase.value },
                })
                .then((res) => {
                    routines.value = res
                })
        }

        // 获取表数据
        const loadTableData = async (table) => {
            await window.ipc
                .sendInvoke('toMain', {
                    event: 'getTableData',
                    params: {
                        database: selectedDatabase.value,
                        table: table,
                    },
                })
                .then((res) => {
                    console.log(res)
                    // tableData.value = res
                    // if (tableData.value.length === 0) {
                    //     tableHeaders.value = []
                    //     return
                    // } else {
                    //     tableHeaders.value = Object.keys(tableData.value[0])
                    // }
                })


            await window.ipc
                .sendInvoke('toMain', {
                    event: 'getTableDetail',
                    params: {
                        database: selectedDatabase.value,
                        table: table,
                    },
                })
                .then((res) => {
                    // tableData.value = res
                    // console.log(res)
                    // if (tableData.value.length === 0) {
                    //     tableHeaders.value = []
                    //     return
                    // } else {
                    //     tableHeaders.value = Object.keys(tableData.value[0])
                    // }
                })
        }

        // 获取存储过程内容
        const loadProcedureDefinition = async (proc) => {
            await window.ipc
                .sendInvoke('toMain', {
                    event: 'getProcedureDefinition',
                    params: {
                        database: selectedDatabase.value,
                        procName: proc.routine_name,

                    },
                })
                .then((res) => {
                    procedureDefinition.value = res
                    if (res && res.length > 0) {
                        console.log(res)
                        procedureDefinition.value = res
                    }
                })



            await window.ipc
                .sendInvoke('toMain', {
                    event: 'getProcedureInout',
                    params: {
                        database: selectedDatabase.value,
                        procName: proc.routine_name,

                    },
                })
                .then((res) => {
                    console.log(res)
                    // procedureDefinition.value = res
                    // if (res && res.length > 0) {
                    //     console.log(res)
                    //     procedureDefinition.value = res
                    // }
                })



        }

        onMounted(() => {
            getDatasources()
        })

        const dataSources = ref([])
        const databases = ref([])
        const tables = ref([])
        const routines = ref([])
        const selectedSouce = ref('')
        const selectedDatabase = ref('')
        const selectedTable = ref('')
        const selectedProcedure = ref('')

        const tableData = ref([])
        const tableHeaders = ref([])
        const procedureDefinition = ref('')

        const dataMap = reactive({
            loadDataSource,
            selectedSouce,
            dataSources,
            databases,
            tables,
            routines,
            selectedDatabase,
            selectedTable,
            selectedProcedure,
            tableData,
            tableHeaders,
            procedureDefinition,
            loadTablesAndRoutines,
            loadTableData,
            loadProcedureDefinition,
        })

        return {
            ...toRefs(dataMap),
        }
    },
})
</script>
