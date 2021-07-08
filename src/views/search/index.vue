<template>
  <div class="search-container">
    <!--搜索栏-->
    <form action="/">
      <van-search v-model="searchText"  @search="onSearch"
                  @cancel="onCancel" show-action placeholder="请输入搜索关键词" />
    </form>
    <!--联想建议-->
    <search-suggestion />
    <!--历史记录-->
    <!--搜索结果-->
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion.vue'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '' // 输入搜索框的内容
    }
  },
  components: {
    SearchSuggestion
  },
  methods: {
    onSearch (val) {
      this.$toast(val)
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
