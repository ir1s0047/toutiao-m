<template>
  <van-icon
    :color="value === 1 ? 'red' : ''"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{ collected: value }"
    @click="ClickNice"
    :loading="loading"
  />
</template>

<script>
import { Likings, UnLikings } from '@/api'
export default {
  data() {
    return {
      loading: false
    }
  },
  name: 'LikeArticle',
  props: {
    value: {
      // type: Boolean,
      required: true
    },
    articleId: {
      // type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async ClickNice() {
      // 开始请求
      this.loading = true
      try {
        let status = -1
        // 是否收藏
        if (this.value === 1) {
          // 父组件 传递articleId
          await UnLikings(this.articleId)
        } else {
          await Likings(this.articleId)
          status = 1
        }
        // 更新视图
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '成功点赞' : '取消点赞')
      } catch (err) {
        this.$toast('操作失败，请重试')
      }
      // 请求结束
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
