<template>
    <div class="home-container">
      <!--导航栏-->
      <van-nav-bar
        class="app-nav-bar">
        <van-button class="search-btn" slot="title" icon="search" size="small" type="info" round>搜索</van-button>
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
      </van-tabs>
    </div>
</template>

<script>
import { getUserChannels } from '../../api/user.js'
import ArticleList from './components/article-list'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [] // 频道列表
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      const res = await getUserChannels()
      this.channels = res.data.data.channels
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
  }
</style>
