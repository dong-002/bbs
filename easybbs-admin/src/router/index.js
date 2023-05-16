import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    redirect: '/forum/article',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/forum',
        name: '内容管理',
        children: [
          {
            path: 'article',
            name: '帖子管理',
            component: () => import('../views/forum/Article.vue'),
          },
          {
            path: 'comment',
            name: '评论管理',
            component: () => import('../views/forum/Comment.vue'),
          },
          {
            path: 'board',
            name: '板块管理',
            component: () => import('../views/forum/Board.vue'),
          },
        ],
      },
      {
        path: '/user',
        name: '用户管理',
        children: [
          {
            path: 'list',
            name: '用户列表',
            component: ()=>import('../views/user/UserList.vue'),
          }
        ]
      },
      {
        path: '/setting',
        name: '设置',
        children: [
          {
            path: 'sys',
            name: '系统设置',
            component: ()=>import('../views/setting/SysSetting.vue'),
          }
        ]
      }
    ],
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})
export default router
