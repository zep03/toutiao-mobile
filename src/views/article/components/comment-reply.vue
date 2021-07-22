<template>
  <div class="coment-reply">
    <!--头部信息-->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!--当前评论项-->
    <comment-item :comment="comment" />
    <!--当前评论的回复列表-->
    <van-cell title="所有回复"></van-cell>
    <comment-list
      :source="comment.com_id"
      type="c"
    :list="commentList"></comment-list>
    <!--底部区域-->
    <div class="bottom-wrap">
      <div class="article-bottom">
        <van-button class="comment-btn"
                    type="default"
                    round
                    @click="isPostShow=true"
                    size="small">
          写评论
        </van-button>
      </div>
    </div>
    <!--发布回复-->
    <van-popup v-model="isPostShow" position="bottom">
      <post-comment :target="comment.com_id"
                    :article-id="articleId"
                    @post-success="onPostSuccess"
      ></post-comment>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import PostComment from './post-comment.vue'
export default {
  name: 'CommentReply',
  data () {
    return {
      isPostShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  props: {
    // 查看回复的评论项
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    onPostSuccess (comment) {
      // 将发布成功的评论放到列表顶部
      this.commentList.unshift(comment)
      // 更新评论的回复的数量
      this.comment.reply_count++
      // 关闭发布回复的弹出层
      this.isPostShow = false
    }
  }
}
</script>

<style scoped lang="less">
  .article-bottom {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    .comment-btn {
      width: 100%;
      height: 40px;
    }
  }
  .article-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 69px;
    overflow-y: auto;
  }
</style>
