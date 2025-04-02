import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      // component: HomeView,
      component: () => import("../views/DataLineageView.vue"),
      meta: {
        title: "首页",
      },
    },
    {
      path: "/dataGovernance",
      name: "dataGovernance",
      meta: {
        title: "数据治理",
      },
      children: [
        {
          path: "dataScriptAnalysis",
          name: "dataScriptAnalysis",
          component: () => import("../views/DataScriptAnalysisView.vue"),
          meta: {
            title: "数据脚本分析",
          },
        },
        {
          path: "dataLineage",
          name: "dataLineage",
          component: () => import("../views/DataLineageView.vue"),
          meta: {
            title: "数据管理",
          },
        },
      ],
    },
    {
      path: "/myExport",
      name: "myExport",
      component: () => import("../views/MyExportView.vue"),
      meta: {
        title: "我的导出",
      },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: {
        title: "关于",
      },
    },
    {
      path: "/setting",
      name: "setting",
      component: () => import("../views/SettingView.vue"),
      meta: {
        title: "设置",
      },
    },
  ],
});

export default router;
