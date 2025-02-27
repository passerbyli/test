<template>
  <div id="app">
    <el-container>
      <HeaderComp @open-settings="openSettings" />
      <el-container>
        <SidebarComp />
        <el-main>
          <router-view></router-view> <!-- 路由视图 -->
        </el-main>
      </el-container>
      <el-footer style="text-align: center; height: 40px;">状态栏</el-footer>
    </el-container>
    <SettingsModal ref="settingsModal" />
  </div>
</template>

<script>
import HeaderComp from './components/HeaderComp.vue';
import SidebarComp from './components/SidebarComp.vue';
import SettingsModal from './components/SettingsModal.vue';

export default {
  components: {
    HeaderComp,
    SidebarComp,
    SettingsModal
  },
  methods: {
    openSettings() {
      this.$refs.settingsModal.visible = true;
    }
  }
};
</script>