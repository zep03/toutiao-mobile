<template>
    <div class="article-list" ref="article-list">
      <van-pull-refresh :success-duration="1500" :success-text="refreshSuccessText" v-model="isRefreshLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
<!--          <van-cell v-for="(article, index) in articles" :key="index" :title="article.title" />-->
        <article-item v-for="(article, index) in articles" :key="index" :article="article"/>
        </van-list>
      </van-pull-refresh>
    </div>
</template>

<script>
import { getArticles } from '../../../api/article'
import ArticleItem from '../../../components/article-item/index.vue'
import { debounce } from 'lodash'
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [], // 数据列表
      loading: false, // 控制加载中的loading状态
      finished: false, // 控制加载结束的状态，当加载结束，不再触发加载更多
      timestamp: null, // 获取下一页数据的时间戳
      isRefreshLoading: false, // 下拉刷新的loading状态
      refreshSuccessText: '', // 下拉刷新成功的提示文本
      scrollTop: 0 // 列表滚动到的地方与顶部之间的距离
    }
  },
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道的id
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        // timestamp相当于页码，请求最新数据使用当前的时间戳，请求下一页数据，使用上一次返回的数据的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      console.log(data)
      // 2. 把数据放到articles数组中
      const { results } = data.data
      this.articles.push(...results)
      // 3. 设置本次加载状态结束，他才可以判断是否需要加载下一次，否则永远都会停在这里
      this.loading = false
      // 4. 数据全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了，把加载状态设置为结束，不在触发加载更多
        this.finished = true
      }
    },
    async onRefresh () {
      // 下拉刷新，组件自己就会展示loading状态
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道的id
        timestamp: Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        // timestamp相当于页码，请求最新数据使用当前的时间戳，请求下一页数据，使用上一次返回的数据的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // 2. 把数据往数组的前面追加
      const { results } = data.data
      this.articles.unshift(...results)
      // 3. 关闭刷新的状态loading
      this.isRefreshLoading = false
      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  },
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      // console.log(articleList.scrollTop)
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  activated () {
    console.log('从缓存中被激活')
    this.$refs['article-list'].scrollTop = this.scrollTop
    // 把记录的距离顶部的距离重新设置回去
  },
  deactivated () {
    console.log('组件失去活动了')
  }
}
</script>

<style scoped lang="less">

  .article-list {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 50px;
    top: 90px;
    overflow-y: auto;
  }
</style>
