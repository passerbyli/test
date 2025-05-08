import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      // component: HomeView,

      // component: () => import('../views/vue3.vue'),
      // component: () => import('../views/Test1View.vue'),
      // component: () => import('../views/Test0View.vue'),
      // component: () => import('../views/tree.vue'),
      // component: () => import('../views/BloodRelationship.vue'),
      children: [
        {
          path: '',
          name: 'home',
          // component: HomeView,

          // component: () => import('../views/vue3.vue'),
          // component: () => import('../views/Test1View.vue'),
          // component: () => import('../views/Test0View.vue'),
          component: () => import('../views/DataSourceManager.vue'),
          // component: () => import('../views/tree.vue'),

          // component: () => import('../views/BloodRelationship.vue'),
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
              component: () => import('../views/Test0View.vue'),
              meta: {
                title: 'test0',
              },
            },
            {
              path: '/test1',
              name: 'test1',
              component: () => import('../views/Test1View.vue'),
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
              component: () => import('../views/Test4View.vue'),
              meta: {
                title: 'test4',
              },
            },
            {
              path: '/test5',
              name: 'test5',
              component: () => import('../views/Test5View.vue'),
              meta: {
                title: 'test5',
              },
            },
            {
              path: '/test6',
              name: 'test6',
              component: () => import('../views/Test6View.vue'),
              meta: {
                title: 'test6',
              },
            },
            {
              path: '/test7',
              name: 'test7',
              component: () => import('../views/Test7View.vue'),
              meta: {
                title: 'test7',
              },
            },
            {
              path: '/test8',
              name: 'test8',
              component: () => import('../views/Test8View.vue'),
              meta: {
                title: 'test8',
              },
            },
            // {
            //   path: '/test4',
            //   name: 'test4',
            //   component: () => import('../views/Test7View.vue'),
            //   meta: {
            //     title: 'test4',
            //   },
            // },
            // {
            //   path: '/test4',
            //   name: 'test4',
            //   component: () => import('../views/Test7View.vue'),
            //   meta: {
            //     title: 'test4',
            //   },
            // },
            // {
            //   path: '/test4',
            //   name: 'test4',
            //   component: () => import('../views/Test7View.vue'),
            //   meta: {
            //     title: 'test4',
            //   },
            // },
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
    },
  ],
})

export default router
