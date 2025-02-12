<template>
  <el-container style="height: 100vh">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <SidebarComp />
    </el-aside>

    <!-- 主内容区域 -->
    <el-container>
      <!-- 顶部 -->
      <el-header>
        <HeaderComp @open-settings="showSettings = true" />
      </el-header>
      <!-- 内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>

    <!-- 设置弹窗 -->
    <el-dialog title="设置" :visible.sync="showSettings" width="30%">
      <el-form :model="config">
        <el-form-item label="关闭退出应用">
          <el-switch v-model="config.settings.closeOnExit" />
        </el-form-item>
        <el-form-item label="禁用通知">
          <el-switch v-model="config.settings.disableNotifications" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSettings = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">保存</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import HeaderComp from "./components/HeaderComp.vue";
import SidebarComp from "./components/SidebarComp.vue";

export default {
  components: {
    HeaderComp,
    SidebarComp
  },
  data() {
    return {
      showSettings: false,
      config: {
        appName: "",
        version: "",
        settings: {
          closeOnExit: false,
          disableNotifications: false
        }
      }
    };
  },
  created() {
    // 从 Electron 主进程获取配置
    // window.electronAPI.getConfig().then(conf => {
    //   this.config = conf;
    // });
  },
  methods: {
    saveConfig() {
      // window.electronAPI.saveConfig(this.config).then(success => {
      //   if (success) {
      //     this.$message.success("配置已保存！");
      //   } else {
      //     this.$message.error("配置保存失败！");
      //   }
      //   this.showSettings = false;
      // });
    }
  }
};
</script>