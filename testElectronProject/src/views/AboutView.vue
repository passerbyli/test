<template>
  <div id="about">
    <el-row>
      <el-col :span="24">
        数据库： <el-select v-model="selectedDatabase" placeholder="请选择数据库" @change="loadTablesAndRoutines"
          style="width: 200px;">
          <el-option v-for="db in databases" :key="db.Database" :label="db.Database" :value="db.Database"></el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <!-- <el-table :data="tables" style="width: 100%" @row-click="loadTableData"> -->
        <!-- <el-table-column prop="Tables_in_information_schema" label="表名" /> -->
        <!-- <el-table-column prop="Tables_in_sys" label="sys" /> -->
        <!-- <el-table-column prop="Tables_in_mysql" label="创建时间" /> -->
        <!-- <el-table-column prop="Tables_in_performance_schema" label="更新时间" /> -->
        <!-- </el-table> -->
        <p>Table</p>
        <el-select v-model="selectedTable" placeholder="请选择数据库" @change="loadTableData" style="width: 200px;">
          <el-option v-for="table in tables" :key="table" :label="table" :value="table"></el-option>
        </el-select>

      </el-col>

      <el-col :span="12">
        <p>Procedure</p>
        <!-- <el-table :data="routines" style="width: 100%" @row-click="loadProcedureDefinition">
          <el-table-column prop="Name" label="表名" />
          <el-table-column prop="Db" label="数据库" />
          <el-table-column prop="Type" label="类型" />
        </el-table> -->
        <el-select v-model="selectedProcedure" placeholder="请选择数据库" @change="loadProcedureDefinition"
          style="width: 200px;">
          <el-option v-for="routine in routines" :key="routine" :label="routine" :value="routine"></el-option>
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
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  setup() {
    const databases = ref([]);
    const tables = ref([]);
    const routines = ref([]);
    const selectedDatabase = ref("");
    const selectedTable = ref("");
    const selectedProcedure = ref("");

    const tableData = ref([]);
    const tableHeaders = ref([]);
    const procedureDefinition = ref("");

    // 获取数据库列表
    const loadDatabases = async () => {
      await window.ipc.sendInvoke("toMain", { event: "getDataBases" }).then(res => {
        databases.value = res;
      });
    };

    // 获取表列表和存储过程列表
    const loadTablesAndRoutines = async () => {
      if (!selectedDatabase.value) return;
      await window.ipc.sendInvoke("toMain", { event: "getTables", params: { database: selectedDatabase.value } }).then(res => {
        tables.value = res;
      });
      await window.ipc.sendInvoke("toMain", {
        event: "getRoutines", params: { database: selectedDatabase.value }
      }).then(res => {
        routines.value = res;
      });
    };

    // 获取表数据
    const loadTableData = async (row, column) => {
      let table = ''
      if (column.property === 'Tables_in_information_schema') {
        table = row['Tables_in_information_schema']
      }
      await window.ipc.sendInvoke("toMain", { event: "getTableData", params: { database: selectedDatabase.value, table: table } }).then(res => {
        tableData.value = res;
        if (tableData.value.length === 0) {
          tableHeaders.value = [];
          return;
        } else {
          tableHeaders.value = Object.keys(tableData.value[0]);
        }
      });
    };

    // 获取存储过程内容
    const loadProcedureDefinition = async (row, column) => {
      await window.ipc.sendInvoke("toMain", { event: "getProcedureDefinition", params: { database: selectedDatabase.value, procName: row['Name'] } }).then(res => {
        procedureDefinition.value = res;
        if (res && res.length > 0) {
          procedureDefinition.value = res[0]['Create Procedure'];
        }
      });
    };

    onMounted(() => {
      loadDatabases();
    });

    return {
      databases,
      tables,
      routines,
      selectedDatabase,
      tableData,
      tableHeaders,
      procedureDefinition,
      loadTablesAndRoutines,
      loadTableData,
      loadProcedureDefinition,
    };
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>