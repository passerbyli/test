import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首页',
      },
    },
    {
      path: '/dataGovernance',
      name: 'dataGovernance',
      meta: {
        title: '数据治理',
      },
      children: [
        {
          path: '/dataScriptAnalysis',
          name: 'dataScriptAnalysis',
          component: () => import('../views/DataScriptAnalysisView.vue'),
          meta: {
            title: '数据脚本分析',
          },
          children: [],
        },
        {
          path: '/dataLineage',
          name: 'dataLineage',
          component: () => import('../views/DataLineageView.vue'),
          meta: {
            title: '数据管理',
          },
        },
      ],
    },
    {
      path: '/myExport',
      name: 'myExport',
      component: () => import('../views/MyExportView.vue'),
      meta: {
        title: '我的导出',
      },
    },
    {
      path: '/test',
      name: 'test',
      meta: {
        title: 'test',
      },
      children: [
        {
          path: '/test1',
          name: 'test1',
          component: () => import('../views/TestView.vue'),
          meta: {
            title: 'test1',
          },
        },
        {
          path: '/test2',
          name: 'test2',
          component: () => import('../views/Test2View.vue'),
          meta: {
            title: 'test2',
          },
        },
        {
          path: '/test3',
          name: 'test3',
          component: () => import('../views/Test3View.vue'),
          meta: {
            title: 'test3',
          },
        },
        {
          path: '/test4',
          name: 'test4',
          component: () => import('../views/TestView.vue'),
          meta: {
            title: 'test4',
          },
        },
      ],
    },

    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: '关于',
      },
    },
    {
      path: '/log2',
      name: 'log2',
      component: () => import('../views/LogTableView.vue'),
      meta: {
        title: 'log2',
      },
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('../views/SettingView.vue'),
      meta: {
        title: '设置',
      },
    },
  ],
})

export default router
