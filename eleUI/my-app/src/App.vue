<template>
  <el-container style="height: 100vh">

    <!-- 顶部导航 -->
    <el-header>
      <Header @open-settings="showSettings = true" />
    </el-header>
    <!-- 主内容区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <Sidebar />
      </el-aside>

      <!-- 页面主体 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <!-- 设置弹窗 -->
    <el-dialog title="设置" :visible.sync="showSettings" width="30%">
      <el-form>
        <el-form-item label="是否点击关闭退出应用">
          <el-switch v-model="settings.closeOnExit"></el-switch>
        </el-form-item>
        <el-form-item label="是否关闭通知">
          <el-switch v-model="settings.disableNotifications"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showSettings = false">取消</el-button>
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </span>
    </el-dialog>
  </el-container>


</template>

<script>
import Sidebar from "@/components/SidebarComp.vue";
import Header from "@/components/HeaderComp.vue";
// const fs = window.require("fs");
// const path = window.require("path");

export default {
  components: {
    Sidebar,
    Header,
  },
  data() {
    return {
      showSettings: false,
      settings: {
        closeOnExit: false,
        disableNotifications: false,
      },
    };
  },
  created() {
    this.loadSettings();
  },
  methods: {
    // 加载配置
    loadSettings() {
      // const configPath = path.join(__dirname, "config.json");
      // if (fs.existsSync(configPath)) {
      //   const data = fs.readFileSync(configPath, "utf-8");
      //   this.settings = JSON.parse(data);
      // }
    },
    // 保存配置
    saveSettings() {
      // const configPath = path.join(__dirname, "config.json");
      // fs.writeFileSync(configPath, JSON.stringify(this.settings, null, 2));
      // this.showSettings = false;
      // this.$message.success("设置已保存");
    },
  },
};
</script>

<style>
/* 让整个布局更紧凑 */
.el-container {
  height: 100vh;
}

.el-header {
  background-color: #409eff;
  color: white;
  text-align: left;
  font-size: 18px;
  padding-left: 20px;
  display: flex;
  align-items: center;
}
</style>