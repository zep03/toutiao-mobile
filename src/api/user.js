/*
* 用户相关请求模块
* */
import request from '../utils/request'
// 在非组件模块中获取store 必须采用这种方式
// import store from '../store/index.js'

/* 登录注册 */
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: data
  })
}

/* 发送短信验证码 */
export const sendSms = (mobile) => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

/* 获取登录用户的个人信息 */
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

/* 获取用户频道列表 */
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

/* 关注用户 */
export const addFollow = (userId) => {
  return request({
    method: 'POST',
    url: 'app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/* 取消关注用户 */
export const deleteFollow = (userId) => {
  return request({
    method: 'DELETE',
    url: `app/v1_0/user/followings/${userId}`
  })
}
