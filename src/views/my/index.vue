<template>
    <div class="my-container">
      <div class="user-info">
        <van-cell-group v-if="user" class="my-info">
          <van-cell :border="false" center class="base-info">
            <div slot="icon">
              <van-image
                class="avatar"
                round
                fit="cover"
                :src="currentUser.photo"
              />
            </div>
            <div slot="title" class="name">{{ currentUser.name }}</div>
            <van-button class="update-btn"
                        size="small"
                        round
                        to="/user/profile"
            >编辑资料</van-button>
          </van-cell>
          <van-grid :border="false" class="data-info">
            <van-grid-item class="data-info-item">
              <div class="text-wrap" slot="text">
                <div class="count">{{ currentUser.art_count }}</div>
                <div class="text">头条</div>
              </div>
            </van-grid-item >
            <van-grid-item class="data-info-item" >
              <div class="text-wrap" slot="text">
                <div class="count">{{ currentUser.follow_count }}</div>
                <div class="text">关注</div>
              </div>
            </van-grid-item>
            <van-grid-item class="data-info-item">
              <div class="text-wrap" slot="text">
                <div class="count">{{ currentUser.fans_count }}</div>
                <div class="text">粉丝</div>
              </div>
            </van-grid-item>
            <van-grid-item class="data-info-item">
              <div class="text-wrap" slot="text">
                <div class="count">{{ currentUser.like_count }}</div>
                <div class="text">获赞</div>
              </div>
            </van-grid-item>
          </van-grid>
        </van-cell-group>
        <div v-else class="not-login">
          <div @click="$router.push({
            name: 'login',
            query: {
              redirect: '/my'
            }
          })">
            <img class="mobile" src="./下载.png" alt="">
            <div class="text">注册 / 登录</div>
          </div>
        </div>
        <van-grid class="nav-grid mb-4" :column-num="2">
          <van-grid-item class="nav-grid-item" icon-prefix="iconfont icon" icon="shoucang" text="收藏" />
          <van-grid-item class="nav-grid-item" icon-prefix="iconfont icon" icon="lishi" text="历史" />
        </van-grid>
        <van-cell title="消息通知" is-link to="/" />
        <van-cell class="mb-4"
                  title="小智同学"
                  is-link
                  to="/user/chat" />
        <van-cell v-if="user" @click="onLogout" class="logout-cell" title="退出登录" />
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '../../api/user.js'
export default {
  name: 'MyIndex',
  data () {
    return {
      currentUser: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadCurrentUser()
  },
  methods: {
    onLogout () {
      // 提示用户确认退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？'
      })
        .then(() => {
          // on confirm
          // 清除登录状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
      // 确认-> 退出登录
    },
    async loadCurrentUser () {
      const res = await getCurrentUser()
      console.log(res)
      this.currentUser = res.data.data
    }
  }
}
</script>

<style scoped lang="less">
  .logout-cell .van-cell__title {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
  .my-info {
    background: url("./banner.png") no-repeat;
    background-size: cover;
    .base-info {
      background-color: unset;
      height: 115px;
      box-sizing: border-box;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #ffffff;
        margin-right: 11px;
      }
      .name {
        color: #ffffff;
        font-size: 15px;
      }
      .update-btn {
        height: 26px;
        font-size: 16px;
        color: #666666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #ffffff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }

      }
    }
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }
  .not-login {
    height: 180px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      color: #ffffff;
      font-size: 14px;
    }
  }

  .nav-grid {
    .nav-grid-item {
      height: 70px;
      /deep/ .iconfont {
        font-size: 22px;
      }
      /deep/ .icon-shoucang {
        color: #eb5253;
      }
      /deep/ .icon-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333333;
      }
    }
  }
</style>
