<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getSearchList"
    >
      <van-cell
        v-for="(item, index) in searchlist"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>
<script>
import { getSearchList } from '@/api'
export default {
  data() {
    return {
      searchlist: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  methods: {
    async getSearchList() {
      try {
        const { data } = await getSearchList({
          page: this.page,
          per_page: this.perPage,
          q: this.keywords
        })
        const { results } = data.data
        this.searchlist.push(...results)
        this.loading = false

        if (results.length !== 0) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (error) {
        this.$toast.fail('获取数据失败，请重试')
      }
    }
  }
}
</script>

<style></style>
