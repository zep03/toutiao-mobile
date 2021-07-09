<template>
    <div class="search-suggestion">
      <van-cell v-for="(str, index) in suggestions"
                :key="index" icon="search" @click="$emit('search', str)" >
        <div slot="title" v-html="hightlight(str)"></div>
      </van-cell>
    </div>
</template>
<script>
import { getSearchSuggestions } from '../../../api/search.js'
import { debounce } from 'lodash'
// /*// 函数防抖
// const fn = _.debounce(function () {
//   console.log('hello')
// }, 1000)
//
// fn()
// fn()
// setTimeout(() => {
//   fn()
// }, 1200)
// fn()*/
export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    // 属性名：要监视的数据的名称
    // searchText () {
    //   console.log('je')
    // }
    // 监视的完整写法
    searchText: {
      // 当数据发生变化则会执行 handler处理函数
      handler: debounce(async function () {
        // 发请求
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200),
      // async handler () {
      //   // 发请求
      //   const { data } = await getSearchSuggestions(this.searchText)
      //   this.suggestions = data.data.options
      // },
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    hightlight (str) {
      // RegExp()是正则表达式的构造函数
      // 参数1： 字符串
      // 参数2： 匹配模式
      // 返回值： 正则对象
      const regStr = new RegExp(this.searchText, 'gi')
      return str.replace(regStr, `<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style scoped>

</style>
