<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="schema" name="first">
      <el-row></el-row>
      <el-row>
        <el-table :data="tableData" style="width: 100%" height="250">
          <el-table-column fixed prop="date" label="Date" width="150" />
          <el-table-column prop="name" label="Name" width="120" />
          <el-table-column prop="state" label="State" width="120" />
          <el-table-column prop="city" label="City" width="320" />
          <el-table-column prop="address" label="Address" width="600" />

        </el-table>
      </el-row>

    </el-tab-pane>
    <el-tab-pane label="表" name="fourth">



    </el-tab-pane>
    <el-tab-pane label="存储过程" name="second"> <el-table :data="tableData" style="width: 100%" height="250">
        <el-table-column fixed prop="date" label="Date" width="150" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="320" />
        <el-table-column prop="address" label="Address" width="600" />
        <el-table-column label="Zip">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
              Edit
            </el-button>
            <el-button size="small" @click="drawer2 = true">
              Edit
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="dialogVisible" fullscreen top="40vh" width="70%" draggable @opened="handleOpen">

        <pre><code ref="sqlCode" class="sql"></code></pre>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false">
              Confirm
            </el-button>
          </div>
        </template>
      </el-dialog>
      <el-drawer v-model="drawer2" :direction="direction">
        <template #header>
          <h4>set title by slot</h4>
        </template>
        <template #default>
          <div>
            111
          </div>
        </template>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancelClick">cancel</el-button>
            <el-button type="primary" @click="confirmClick">confirm</el-button>
          </div>
        </template>
      </el-drawer>
    </el-tab-pane>
    <el-tab-pane label="调度任务" name="third">调度任务</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>

import hljs from 'highlight.js/lib/core'
import sql from 'highlight.js/lib/languages/sql'
import 'highlight.js/styles/github.css' // 主题样式
import { ref, onMounted } from 'vue'

import { ElMessageBox } from 'element-plus'
import type { DrawerProps } from 'element-plus'

const direction = ref<DrawerProps['direction']>('btt')
function cancelClick() {
  drawer2.value = false
}

function confirmClick() {
  ElMessageBox.confirm(`Are you confirm to chose ?`)
    .then(() => {
      drawer2.value = false
    })
    .catch(() => {
      // catch error
    })
}
hljs.registerLanguage('sql', sql)

const sqlCode = ref(null)


const sqlContent = `
  CREATE OR REPLACE PROCEDURE ct_cms.etl_user_orders(target_date DATE)
      LANGUAGE plpgsql AS $$
      BEGIN
      -- 阶段1：在临时Schema中创建临时表
      CREATE TEMP TABLE tmp_raw_orders ON COMMIT DROP AS
      SELECT
      o.order_id,
      u.user_id,
      o.amount::NUMERIC(12,2) AS amount,
      o.order_time
      FROM ct_cms.orders o -- 源表带Schema‌:ml-citation{ref="6" data="citationList"}
      JOIN ct_cms.users u USING (user_id)
      WHERE o.order_date = target_date;

      -- 阶段2：使用多层WITH处理
      WITH user_stats AS (
      SELECT
      user_id,
      COUNT(*) AS order_count,
      SUM(amount) AS total_amount
      FROM tmp_raw_orders
      GROUP BY user_id
      ),
      latest_orders AS (
      SELECT DISTINCT ON (user_id)
      user_id,
      order_time AS last_order
      FROM tmp_raw_orders
      ORDER BY user_id, order_time DESC
      )
      truncate table ct_cms.user_orders_wide_a;
      -- 阶段3：写入目标Schema的物理表
      INSERT INTO ct_cms.user_orders_wide_a
      SELECT
      u.user_id,
      u.username,
      s.order_count,
      s.total_amount,
      l.last_order
      FROM ct_cms.users u -- 显式指定源Schema‌:ml-citation{ref="3" data="citationList"}
      LEFT JOIN user_stats s USING (user_id)
      LEFT JOIN latest_orders l USING (user_id)
      WHERE u.created_at <= target_date;
        public.p_rename_table('ct_cms','user_orders_wide_a','ct_cms','user_orders_wide') -- 清理临时表（ON COMMIT DROP自动处理）
        EXCEPTION WHEN others THEN RAISE NOTICE 'ETL失败: %' , SQLERRM; ROLLBACK; END; $$;
`


const handleEdit = (index, row) => {
  console.log(index, row)
  dialogVisible.value = true

}

const handleOpen = () => {
  if (sqlCode.value) {
    const result = hljs.highlight(sqlContent, { language: 'sql' })
    sqlCode.value.innerHTML = result.value
  }
}

onMounted(() => {
  if (sqlCode.value) {
    console.log('1239120')
    sqlCode.value.innerText = sqlContent
    console.log(sqlCode.value)
    hljs.highlightElement(sqlCode.value)
  }
})

const drawer2 = ref(false)

const dialogVisible = ref(false)
const activeName = ref('first')
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
]
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style>
.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

pre {
  background-color: #f8f8f8;
  padding: 12px;
  overflow-x: auto;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
}
</style>
