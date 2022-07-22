<template>
  <van-icon
    :color="value ? '#ffa500' : ''"
    :name="value ? 'star' : 'star-o'"
    :class="{ collected: value }"
    @click="onCollect"
    :loading="loading"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api'
export default {
  data() {
    return {
      loading: false
    }
  },
  name: 'CollectArticle',
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
    async onCollect() {
      // 开始请求
      this.loading = true
      try {
        // 是否收藏
        if (this.value) {
          // 父组件 传递articleId
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(this.value ? '取消收藏' : '收藏成功')
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
