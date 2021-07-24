import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../views/login/index.vue'
// const Login = () => import('../views/login/index.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/layout/index.vue'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('../views/home/index.vue')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('../views/qa/index.vue')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('../views/video/index.vue')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('../views/my/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/index.vue')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('../views/article/index.vue'),
    props: true // 将动态路由参数映射到组件的props中，无论是访问还是维护都更加方便
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('../views/user-profile/index.vue')
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('../views/user-chat/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
