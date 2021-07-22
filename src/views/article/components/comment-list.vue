<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item v-for="(comment, index) in list"
                    :key="index"
                    :comment="comment"
                    @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '../../../api/comment.js'
import CommentItem from './comment-item.vue'
export default {
  name: 'CommentList',
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的页码
      limit: 10 // 每页大小
    }
  },
  components: {
    CommentItem
  },
  props: {
    // 如果获取文章评论，则传递文章id
    // 如果获取评论回复，则传递评论id
    source: {
      type: [String, Number, Object],
      required: true
    },
    list: {
      type: Array,
      // 数组或对象的默认值必须通过函数返回
      default: function () {
        return []
      }
    },
    // 获取文章评论，使用字符a
    // 获取评论回复，使用字符c
    type: {
      type: String,
      default: 'a'
    }
  },
  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getComments({
        type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.source.toString(), // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      })
      console.log(data)
      this.$emit('update-total-count', data.data.total_count)
      // 2. 把数据放到列表中
      const { results } = data.data
      this.list.push(...results)
      // 3. 加载状态结束
      this.loading = false
      // 4. 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        // 如果没有，则将finished设置为true，不再触发加载更多
        this.finished = true
      }
    }
  }
}
</script>

<style scoped>

</style>
