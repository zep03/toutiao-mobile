<template>
    <div class="home-container">
      <!--导航栏-->
      <van-nav-bar
        class="app-nav-bar">
        <van-button class="search-btn" slot="title" icon="search" size="small" type="info" round to="/search">搜索</van-button>
      </van-nav-bar>
      <!--文章频道列表-->
      <!--
        标签页组件有一个功能，只有你第1次查看标签页的时候，才会渲染里面的内容
      -->
      <van-tabs v-model="active" class="channel-tabs">
        <van-tab v-for="channel in channels" :title="channel.name" :key="channel.id">
          <!--文章列表-->
          <article-list :channel="channel"></article-list>
        </van-tab>
        <div slot="nav-right" class="wap-nav-placeholder"></div>
        <div slot="nav-right" @click="isChannelEditShow = true" class="wap-nav-wrap">
          <van-icon name="wap-nav"></van-icon>
        </div>
      </van-tabs>
      <!--频道编辑的弹出层-->
      <van-popup closeable get-container="body" close-icon-position="top-left" v-model="isChannelEditShow" position="bottom" class="channel-edit-popup" >
        <channel-edit :active="active" @update-active="onUpdateActive" @close="isChannelEditShow = false" :user-channels="channels"></channel-edit>
      </van-popup>
    </div>
</template>

<script>
import { getUserChannels } from '../../api/user.js'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '../../utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: false // 是否显示频道编辑的弹框
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
        // 已登录，请求获取线上的用户频道列表数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 未登录，先判断是否有本地存储的列表数据
        const loacalChannels = getItem('user-channels')
        // 如果有本地存储的频道列表，则使用本地的
        if (loacalChannels) {
          channels = loacalChannels
        } else {
          // 用户没有登录，也没有本地存储的频道列表，那就请求获取默认推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      // 把处理好的数据放到data中以供模板使用
      this.channels = channels
    },
    onUpdateActive (index) {
      this.active = index
    }
  }
}
</script>

<style scoped lang="less">
  .home-container {
    /deep/ .van-nav-bar__title {
      max-width: unset;
    }
    .search-btn {
      width: 277px;
      height: 32px;
      background-color: #5babfb;
      border: none;
      .van-button__text {
        font-size: 14px;
      }
      .van-icon {
        font-size: 16px;
      }
    }
    .channel-tabs {
      /deep/ .van-tab {
        border-right: 1px solid #edeff3;
        border-bottom: 1px solid #edeff3;
      }
      /deep/ .van-tabs__line {
        width: 15px !important;
        height: 3px;
        background-color: #3296fa;
        margin-bottom: 6px;
      }
    }
    .wap-nav-placeholder {
      width: 33px;
      flex-shrink: 0;
    }
    .wap-nav-wrap {
      position: fixed;
      right: 0;
      height: 44px;
      width: 33px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      opacity: 0.9;
      .van-icon {
        font-size: 26px;
      }
    }
  }
  .channel-edit-popup{
    height: 100%;
  }
</style>
