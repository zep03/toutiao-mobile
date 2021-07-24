<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="注册/登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!--登录表单-->
    <!--
      基于Vant的表单验证：
        1. 使用van-form组件包裹所有的表单项van-field
        2. 给van-form绑定submit事件，当表单提交时触发该事件
            提示： 只有表单验证通过才会触发submit事件
        3. 使用 Field的rules属性定义校验规则
    -->
    <van-form ref="login-form" @submit="onLogin" @failed="onFailed" :validate-first="true" :show-error="false" :show-error-message="false">
        <van-field
          v-model="user.mobile"
          icon-prefix="iconfont icon"
          left-icon="shouji"
          name="mobile"
          placeholder="请输入手机号"
          center
          :rules="formRules.mobile"
        />
        <van-field
          v-model="user.code"
          clearable
          icon-prefix="iconfont icon"
          left-icon="yanzhengma"
          name="code"
          placeholder="请输入验证码"
          center
          :rules="formRules.code">
          <template #button>
            <van-count-down @finish="isCountDownShow=false" v-if="isCountDownShow" :time="1000 * 60" format="ss s"/>
            <van-button v-else @click.prevent="onSendSms" class="send-btn" size="small" :loading="isSendSmsloading" round>发送验证码</van-button>
          </template>
        </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '../../api/user.js'
import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'onChange' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误', trigger: 'onChange' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'onChange' },
          { pattern: /^\d{6}$/, message: '验证码格式错误', trigger: 'onChange' }
        ]
      },
      isCountDownShow: false, // 控制倒计时和发送按钮的显示与隐藏
      isSendSmsloading: false // 发送验证码按钮的loading状态
    }
  },
  methods: {
    async onLogin () {
      Toast.loading({
        message: '登录中...',
        forbidClick: true, // 是否禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
      })
      try {
        const res = await login(this.user)
        console.log(res)
        Toast.success('登录成功')

        // 将后端返回的用户登录状态（token等数据）放到Vuex容器中
        this.$store.commit('setUser', res.data.data)
        // 清除layout的缓存，让它重新渲染
        this.$store.commit('removeCachePage', 'LayoutIndex')

        this.$router.back()
      } catch (err) {
        console.log('登陆失败', err)
        Toast.fail('登录失败，手机号或验证码错误！')
      }
    },
    onFailed (error) {
      console.log(error)
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    async onSendSms () {
      // 校验手机号码
      try {
        await this.$refs['login-form'].validate('mobile')
        // 验证通过，请求发送验证码
        this.isSendSmsloading = true //  展示按钮点loading状态，防止网络慢用户多次点击触发发送行为
        const res = await sendSms(this.user.mobile)
        console.log(res)
        // 请求发送验证码 -> 隐藏发送验证码按钮，显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        console.log('验证失败', err)
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁了，请稍后重试！'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '未知错误，发送失败，请稍后重试！'
        }
        this.$toast({
          message: message,
          position: 'top'
        })
      }
      // 无论发送验证码成功还是失败都要关闭发送按钮的loading状态
      this.isSendSmsloading = false
      // 验证通过 -> 请求发送验证码 -> 用户接收短信 -> 输入验证码 -> 请求登录
      // 请求发送验证码 -> 隐藏发送验证码按钮，显示倒计时
      // 倒计时结束 -> 显示发送验证码按钮，隐藏倒计时
    }
  }
}
</script>

<style scoped lang="less">
  .login-container {
    .send-btn {
      width: 85px;
      height: 23px;
      background-color: #ededed;

      .van-button__text {
        font-size: 11px;
        color: #666666;
      }
    }

    .login-btn-wrap {
      padding: 26px 16px;

      .login-btn {
        background-color: #3296fa !important;
        border: none;

        .van-button__text {
          font-size: 15px;
        }
      }
    }
  }
</style>
