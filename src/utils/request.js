/*
* 请求模块
* */
import axios from 'axios'
// 在非组件模块中获取store 必须采用这种方式
import store from '../store/index.js'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  // 如果用户已登录，统一给接口设置token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完之后一定要把config 返回，否则请求发不出去
  return config
}, function (err) {
  return Promise.reject(err)
})

// 响应拦截器

// 导出
export default request
