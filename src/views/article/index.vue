<template>
  <div class="article-container">
    <!--导航栏-->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <h1 class="title">{{ article.title }}</h1>
    <van-cell center class="user-info">
      <div slot="title" class="name">{{ article.aut_name }}</div>
      <van-image
        class="avatar"
        slot="icon"
        fit="cover"
        round
        :src="article.aut_photo"
      />
      <div slot="label" class="pubdate">{{ article.pubdate | relativeTime }}</div>
      <van-button :icon="article.is_followed ? '' : 'plus'"
                  class="follow-btn" round size="small"
                  @click="onFollow"
                  :loading="isFollowLoading"
                  :type="article.is_followed ? 'default' : 'info'">
        {{ article.is_followed ? '已关注' : '关注' }}
      </van-button>
    </van-cell>
    <div ref="article-content"
         class="content markdown-body"
         v-html="article.content">
    </div>
    <!--底部区域-->
    <div class="article-bottom">
      <van-button class="comment-btn"
      type="default"
      round
      size="small">
        写评论
      </van-button>
      <van-icon name="comment-o" info="123" color="#777" />
      <van-icon :name="article.is_collected ? 'star' : 'star-o'"
                :color="article.is_collected ? 'orange' : '#777'"
                @click="onCollect"
      />
      <van-icon :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
                :color="article.attitude === 1 ? 'red' : '#777'"
                @click="onLike"
      />
      <van-icon name="share" color="#777" />
    </div>
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById, addCollect, deleteCollect, addLike, deleteLike } from '../../api/article'
import { addFollow, deleteFollow } from '../../api/user'
import { ImagePreview } from 'vant'

// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   startPosition: 1
// })
// 在组件中获取动态路由参数：
//   方式一： this.$route.params.xxx
//   方式二： props传参
export default {
  name: 'ArticleIndex',
  data () {
    return {
      article: {}, // 文章数据对象
      isFollowLoading: false // 关注用户按钮的loading状态
    }
  },
  props: {
    articleId: {
      type: [String, Object, Number],
      required: true
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      console.log(data)
      this.article = data.data
      // 数据改变影响视图更新（DOM数据）不是立刻的，所以
      // 如果需要在修改数据之后马上操作被该数据影响的视图Dom,需要
      // 把这个代码放到 $nextTick中
      this.$nextTick(() => {
        this.handlePreviewImage()
      })
    },
    handlePreviewImage () {
      // 1. 获取文章内容dom容器
      const articleContent = this.$refs['article-content']
      // 2. 得到所有的img标签
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = [] // 收集所有的图片路径
      // 3. 循环img列表，给每个img注册点击事件
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        // 4. 在事件处理函数中调用ImagePreview（）预览
        img.onclick = function () {
          ImagePreview({
            images: imgPaths, // 预览图片路径列表
            startPosition: index // 起始位置
          })
        }
      })
    },
    async onFollow () {
      this.isFollowLoading = true
      // 已关注，则取消关注
      // 没有关注，则添加关注
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id)
      } else {
        await addFollow(this.article.aut_id)
      }
      // 更新视图
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },
    async onCollect () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      // 已收藏，则取消收藏
      // 没有收藏，则添加收藏
      if (this.article.is_collected) {
        await deleteCollect(this.articleId)
      } else {
        await addCollect(this.articleId)
      }
      // 更新视图
      this.article.is_collected = !this.article.is_collected
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    async onLike () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景点击
      })
      // 已点赞，则取消点赞
      // 没有点赞，则点赞
      if (this.article.attitude === 1) {
        await deleteLike(this.articleId)
        this.article.attitude = -1
      } else {
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      // 更新视图
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    }
  }
}
</script>

<style scoped lang="less">

  .title {
    font-size: 20px;
    color: #3a3a3a;
    padding: 14px;
    background-color: #ffffff;
    margin: 0;
  }
  .user-info {
    .name {
      font-size: 15px;
      color: #333333;
    }
    .pubdate {
      font-size: 12px;
      color: #b4b4b4;
    }
    .avatar {
      width: 45px;
      height: 45px;
      margin-right: 8px;
    }
    .follow-btn {
      width: 85px;
      height: 29px;
    }
  }
  ul, ol {
    list-style: unset;
  }
  .markdown-body {
    padding: 14px;
    background-color: #ffffff;
  }
  .article-bottom {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .comment-btn {
      width: 150px;
    }
    .van-icon {
      font-size: 25px;
    }
  }
</style>
