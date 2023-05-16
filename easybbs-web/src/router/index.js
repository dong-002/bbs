import {createRouter,createWebHistory} from 'vue-router'
import {useStore} from "@/store/index.js"

const routes=[
  {
    path: '/',
    name: 'layout',
    component: ()=>import('@/views/Layout.vue'),
    children: [
      {
        path: '/',
        name: '所有文章',
        component: ()=>import('@/views/forum/ArticleList.vue')
      },
      {
        path: '/forum/:pBoardId',
        name: '一级板块',
        component: ()=>import('@/views/forum/ArticleList.vue')
      },
      {
        path: '/forum/:pBoardId/:boardId',
        name: '二级板块',
        component: ()=>import('@/views/forum/ArticleList.vue')
      },
      {
        path: '/post/:articleId',
        name: '文章详情',
        component: ()=>import('@/views/forum/ArticleDetail.vue')
      },
      {
        path: '/newPost',
        name: '发布文章',
        component: ()=>import('@/views/forum/EditPost.vue')
      },
      {
        path: '/editPost/:articleId',
        name: '编辑文章',
        component: ()=>import('@/views/forum/EditPost.vue')
      },
      {
        path: '/user/:userId',
        name: '用户信息',
        component: ()=>import('@/views/userCenter/UserCenter.vue')
      },
      {
        path: '/user/message/:type',
        name: '消息',
        component: ()=>import('@/views/userCenter/MessageList.vue')
      },
      {
        path: '/search',
        name: '搜索',
        component: ()=>import('@/views/Search.vue')
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404页面',
    component: ()=>import('@/views/404NotFound.vue')
  }
]
const router=createRouter({
  routes,
  history:createWebHistory()
})
// 当跳转到用户中心，一级板块取消选中
router.beforeEach((to,from,next)=>{
  if(to.path.indexOf("/user")!=-1) {
    //store要在这里定义
    const store=useStore()
    store.setActivePBoardId(-1)
  }
  next()
})
export default router