<template>
  <el-dialog :visible.sync="visible" title="设置" @close="handleClose">
    <el-form :model="settings">
      <el-form-item label="是否启用通知">
        <el-switch v-model="settings.notifications" active-text="开启" inactive-text="关闭" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSettings">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      settings: {
        notifications: false
      }
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    saveSettings() {
      this.$store.dispatch('updateSettings', this.settings);
      this.visible = false;
    }
  }
};
</script>