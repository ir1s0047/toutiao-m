<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      :title="item"
      icon="search"
    >
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api'

export default {
  data() {
    return {
      suggestions: []
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  watch: {
    keywords: {
      immediate: true,
      handler() {
        this.getSearchSuggestion()
      }
    }
  },
  methods: {
    async getSearchSuggestion() {
      try {
        const res = await getSearchSuggestion(this.keywords)
        if (res.data.data.options.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
        this.suggestions = res.data.data.options.fliet(Boolean)
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    highlightData() {
      const reg = new RegExp(this.keywords, 'ig')
      return this.suggestions.map((str) =>
        str?.replace(reg, (match) => `<span style="color: red">${match}</span>`)
      )
    }
  }
}
</script>

<style></style>
