import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '../store/index.js'
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
        component: () => import('../views/home/index.vue'),
        meta: { requiresAuth: false } // 给路由添加额外的自定义数据
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('../views/qa/index.vue'),
        meta: { requiresAuth: false } // 给路由添加额外的自定义数据
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('../views/video/index.vue'),
        meta: { requiresAuth: false } // 给路由添加额外的自定义数据
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('../views/my/index.vue'),
        meta: { requiresAuth: false } // 给路由添加额外的自定义数据
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue'),
    meta: { requiresAuth: false } // 给路由添加额外的自定义数据
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/index.vue'),
    meta: { requiresAuth: false } // 给路由添加额外的自定义数据
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('../views/article/index.vue'),
    meta: { requiresAuth: false }, // 给路由添加额外的自定义数据
    props: true // 将动态路由参数映射到组件的props中，无论是访问还是维护都更加方便
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('../views/user-profile/index.vue'),
    meta: { requiresAuth: false } // 给路由添加额外的自定义数据
  },
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('../views/user-chat/index.vue'),
    meta: { requiresAuth: true } // 给路由添加额外的自定义数据
  }
]

const router = new VueRouter({
  routes
})

// 全局路由导航守卫
// to : 要访问的页面的路由信息
// from : 来自哪个页面的路由信息
// next : 放行的标记
router.beforeEach((to, from, next) => {
  // 判断该页面是否需要登录后才能访问
  if (to.meta.requiresAuth) {
    // 如果已登录，则直接放行
    if (store.state.user) {
      return next()
    }
    // 没有登录，则提示是否登录
    // 校验登录状态，提示用户
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录后才能访问，确认登录吗？'
    })
      .then(() => {
        // 确认则执行这里
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      })
      .catch(() => {
        // 取消则执行这里
        // 中断路由导航，停留在当前页面
        next(false)
      })
  } else {
    // 不需要登录的页面，直接放行
    next()
  }
})

export default router
