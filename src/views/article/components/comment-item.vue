<template>
  <van-cell
    class="comment-item">
    <van-image
      class="avatar"
      slot="icon"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-wrap">
        <div class="name">{{ comment.aut_name }}</div>
        <div slot="default" class="like-wrap" @click="onCommentLike">
          <van-icon class="like-icon"
                    :class="{
                      liked: comment.is_liking
                    }"
                    :name="comment.is_liking ? 'good-job' : 'good-job-o'">
          </van-icon>
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div class="pubdate-wrap">
        <span class="pubdate">{{ comment.pubdate | datetime }}</span>
        <van-button class="reply-btn"
                    round
                    size="small"
                    @click="$emit('reply-click', comment)"
                    plain hairline type="info"
        >{{ comment.reply_count }}回复</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '../../../api/comment'

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onCommentLike () {
      const commentId = this.comment.com_id.toString()
      if (this.comment.is_liking) {
        // 已点赞，则取消点赞
        await deleteCommentLike(commentId)
        this.comment.like_count--
      } else {
        // 没有点赞，则添加点赞
        await addCommentLike(commentId)
        this.comment.like_count++
      }
      // 更新视图
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style scoped lang="less">
  .comment-item {
    .avatar {
      width: 60px;
      height: 60px;
      margin-right: 13px;
    }
    .name {
      font-size: 14px;
      color: #406599;
    }
    .content {
      font-size: 16px;
      color: #222222;
    }
    .pubdate {
      font-size: 12px;
      margin-right: 20px;
    }
    .title-wrap {
      display: flex;
      justify-content: space-between;
    }
    .pubdate-wrap {
      display: flex;
      align-items: center;
    }
  }
  .liked {
    color: red;
  }
</style>
