<template>
  <div>
    <form action="/" class="search">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="backToPrePage"
        @focus="visibleSearchSuggestion"
        background="#3296fa"
      />
    </form>
    <!-- <SearchHistory></SearchHistory>
    <SearchResult></SearchResult>
    <SearchSuggestion></SearchSuggestion> -->
    <component
      :is="componentName"
      :keywords="keywords"
      :searchInfo="searchInfo"
      @getSearchList="getSearchList"
      @delSearchHistory="delSearchHistory"
    ></component>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory.vue'
import SearchResult from './components/SearchResult.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
export default {
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  data() {
    return {
      keywords: '',
      isShowSearchResult: false,
      searchInfo: []
    }
  },
  computed: {
    componentName() {
      if (this.keywords.trim() === '') {
        return 'SearchHistory'
      }
      if (this.isShowSearchResult) {
        return 'SearchResult'
      }
      return 'SearchSuggestion'
    }
  },
  methods: {
    backToPrePage() {
      this.$router.go(-1)
    },
    onSearch() {
      this.isShowSearchResult = true
      // this.searchInfo.push(this.keywords)
      this.searchInfo.unshift(this.keywords)
      this.$store.commit('setSearch', this.searchInfo)
    },
    visibleSearchSuggestion() {
      this.isShowSearchResult = false
    },
    getSearchList(str) {
      this.keywords = str
      this.onSearch()
    },
    // 删除搜索历史
    delSearchHistory(index) {
      if (index === -1) {
        this.searchInfo = []
      } else {
        this.searchInfo.splice(index, 1)
      }
      this.$store.commit('setSearch', this.searchInfo)
    }
  },
  created() {
    this.searchInfo = this.$store.state.search
  }
}
</script>

<style lang="less" scoped>
.search {
  [role='button'] {
    color: #fff;
  }
}
</style>
