import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
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
              path: '/tableAssets',
              name: 'tableAssets',
              component: () => import('../views/TableAssets.vue'),
              meta: {
                title: '表资产',
              },
              children: [],
            },
            {
              path: '/tableDetail',
              name: 'tableDetail',
              component: () => import('../views/TableDetail.vue'),
              meta: {
                title: '表明细',
              },
              children: [],
            },
            {
              path: '/ProcedureAssetOverview',
              name: 'ProcedureAssetOverview',
              component: () => import('../views/ProcedureAssetOverview.vue'),
              meta: {
                title: '存储过程列表',
              },
              children: [],
            },
            {
              path: '/ProcedureDetail',
              name: 'ProcedureDetail',
              component: () => import('../views/ProcedureDetail.vue'),
              meta: {
                title: '存储过程明细',
              },
              children: [],
            },
            {
              path: '/ScheduleTaskOverview',
              name: 'ScheduleTaskOverview',
              component: () => import('../views/ScheduleTaskOverview.vue'),
              meta: {
                title: '调度任务',
              },
              children: [],
            },
            {
              path: '/dataBase',
              name: 'dataBase',
              component: () => import('../views/DataBaseView.vue'),
              meta: {
                title: '数据库',
              },
              children: [],
            },
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
            {
              path: '/dataSourceManager',
              name: 'dataSourceManager',
              component: () => import('../views/DataSourceManager.vue'),
              meta: {
                title: '数据源管理',
              },
            },
          ],
        },
        {
          path: '/test',
          name: 'test',
          meta: {
            title: 'test',
          },
          children: [
            {
              path: '/test0',
              name: 'test0',
              component: () => import('../views/HomeView.vue'),
              meta: {
                title: 'test0',
              },
            },
            {
              path: '/test1',
              name: 'test1',
              component: () => import('../views/HomeView.vue'),
              meta: {
                title: 'test1',
              },
            },
            {
              path: '/test2',
              name: 'test2',
              component: () => import('../views/HomeView.vue'),
              meta: {
                title: 'test2',
              },
            },
            {
              path: '/test3',
              name: 'test3',
              component: () => import('../views/HomeView.vue'),
              meta: {
                title: 'test3',
              },
            },
            {
              path: '/test4',
              name: 'test4',
              component: () => import('../views/HomeView.vue'),
              meta: {
                title: 'test4',
              },
            },
            {
              path: '/test5',
              name: 'test5',
              component: () => import('../views/HomeView.vue'),
              meta: {
                title: 'test5',
              },
            },
            {
              path: '/test6',
              name: 'test6',
              component: () => import('../views/HomeView.vue'),
              meta: {
                title: 'test6',
              },
            },
            {
              path: '/test7',
              name: 'test7',
              component: () => import('../views/HomeView.vue'),
              meta: {
                title: 'test7',
              },
            },
            {
              path: '/test8',
              name: 'test8',
              component: () => import('../views/HomeView.vue'),
              meta: {
                title: 'test8',
              },
            },
          ],
        },

        {
          path: '/about',
          name: 'about',
          component: () => import('../views/HomeView.vue'),
          meta: {
            title: '关于',
          },
        },
        {
          path: '/log2',
          name: 'log2',
          component: () => import('../views/HomeView.vue'),
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
    },
  ],
})

export default router
