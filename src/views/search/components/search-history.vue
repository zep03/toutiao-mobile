<template>
    <div class="search-history">
      <van-cell title="搜索历史">
        <div v-if="isDeleteShow">
          <!--
          prop数据如果是引用类型（数组、对象）可以修改，注意这个修改指的是：user.name=
          ‘Jack'、arr.push（123）、arr.splice（e，1）
          但是任何prop数据都不能重新赋值：xxx=xxx如果你想要让prop数据=新的数据：让父组件自己修改
          -->
          <span @click="$emit('update-histories', [])">全部删除</span>
          &nbsp;&nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon v-else name="delete" @click="isDeleteShow = true" />
      </van-cell>
      <van-cell v-for="(history, index) in searchHistories" :key="index" :title="history" @click="onDelete(history, index)">
        <van-icon v-show="isDeleteShow" name="close" />
      </van-cell>
    </div>
</template>

<script>
import { setItem } from '../../../utils/storage'

export default {
  name: 'SearchHistory',
  data () {
    return {
      isDeleteShow: false // 控制删除按钮的显示状态
    }
  },
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  methods: {
    onDelete (history, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        // 持久化处理
        // 1. 修改本地存储数据
        // 2. 请求接口删除服务器保存到数据
        // 无论是否登录都把数据持久化到本地
        // 提示：没有删除单个历史记录的接口，只有删除全部历史记录的接口
        setItem('search-histories', this.searchHistories)
        return
      }
      // 非删除状态，点击搜索历史记录，则展示搜索结果
      this.$emit('search', history)
    }
  }
}
</script>

<style scoped>

</style>
