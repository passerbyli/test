<template>
  <div>
    <BidInfo :auctionDetail="auctionDetail"/>
    <div class="item-title">历史价格</div>
    <el-table :data="auctionDetail ? (auctionDetail.historyRecord || []) : []" border max-height="300" size="small" ref="tableRef">
      <el-table-column type="index" label="#" min-width="50"></el-table-column>
      <el-table-column label="时间" width="160">
        <template #default="scope">
          <span>{{
              dayjs(scope.row.endTime).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="offerPrice" label="成交价格" min-width="80"></el-table-column>
      <el-table-column prop="userNickname" label="用户昵称" min-width="160"></el-table-column>
    </el-table>
  </div>
</template>

<script>
const dayjs = require("dayjs");
import { defineComponent, reactive, toRefs, watch } from "vue";
import BidInfo from "./BidInfo";

export default defineComponent({
  name: "HistoryPrice",
  components: { BidInfo },
  props: [ "auctionDetail" ],
  setup(props, context) {
    watch(
      () => props.auctionDetail,
      () => {
        // 查询后滚动条滚动到列表顶部
        dataMap.tableRef.scrollTo({ top: 0 });
      }
    );

    const dataMap = reactive({
      dayjs: dayjs,
      tableRef: null,
    });

    return {
      ...toRefs(dataMap),
    };
  },
});
</script>

<style scoped></style>