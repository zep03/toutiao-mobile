<template>
  <div class="post-comment">
    <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="100"
      autofocus
      placeholder="请输入评论"
      show-word-limit
    />
    <van-button size="small"
                type="primary"
                class="pub-btn"
                @click="onPost"
                :disabled="!message"
    >发布</van-button>
  </div>
</template>

<script>
import { addComment } from '../../../api/comment'

export default {
  name: 'PostComment',
  data () {
    return {
      message: '' // 输入框内容
    }
  },
  props: {
    // 如果是发布文章评论，则传递文章id
    // 如果是发布评论回复,则传递评论id
    target: {
      type: [String, Object, Number],
      required: true
    },
    // 如果是发布评论回复，则也需要传递文章id
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布',
        forbidClick: true
      })
      const { data } = await addComment({
        target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: this.message, // 评论内容
        art_id: this.articleId ? this.articleId.toString() : null // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
      })
      // console.log(data)
      this.$toast.success('发布成功')
      // 发布成功，清空文本框内容
      this.message = ''
      this.$emit('post-success', data.data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
  .post-comment {
    display: flex;
    align-items: center;
    padding: 10px;
    .pub-btn {
      width: 80px;
    }
  }
</style>
