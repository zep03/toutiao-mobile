<template>
  <div class="search-container">
    <!--搜索栏-->
    <form action="/">
      <van-search v-model="searchText"  @search="onSearch(searchText)"
                  @focus="isResultShow = false" @cancel="onCancel" show-action placeholder="请输入搜索关键词" />
    </form>
    <!--搜索结果-->
    <search-results v-if="isResultShow" :search-text="searchText" />
    <!--联想建议-->
    <search-suggestion @search="onSearch" v-else-if="searchText" :search-text="searchText"/>
    <!--历史记录-->
    <search-history @update-histories="searchHistories = $event" @search="onSearch" v-else :search-histories="searchHistories" />
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion.vue'
import SearchHistory from './components/search-history.vue'
import SearchResults from './components/search-results.vue'
import { setItem, getItem } from '../../utils/storage'
// import { getSearchHistories } from '../../api/search'

export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '', // 输入搜索框的内容
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistories: getItem('search-histories') || [] // 搜索历史数据
    }
  },
  watch: {
    searchHistories () {
      // 监视搜索历史记录的变化，存储到本地存储中
      setItem('search-histories', this.searchHistories)
    }
  },
  // async created () {
  //   const { data } = await getSearchHistories()
  //   console.log(data)
  // },
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResults
  },
  methods: {
    onSearch (searchText) {
      console.log('onSearch', searchText)
      // 把输入框设置为你要搜索的文本
      this.searchText = searchText
      // 触发搜索，记录搜索历史记录
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 把重复项移除
        this.searchHistories.splice(index, 1)
      }
      // 把最新的搜索历史记录追加到数组的前面
      this.searchHistories.unshift(searchText)

      // 如果用户已登录，则把搜索历史记录存储到服务器
      // 提示：只要我们调用获取搜索结果的数据接口，后端就会给我们自动存储用户的搜索历史记录
      // 如果没有登陆，则把搜索历史存储在本地
      setItem('search-histories', this.searchHistories)
      // 展示搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
