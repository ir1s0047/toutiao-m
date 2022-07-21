<template>
  <div>
    <!-- 历史记录 -->
    <van-cell title="搜索历史">
      <template #default v-if="isShow">
        <van-icon name="delete-o" @click="isShow = !isShow" />
      </template>
      <template #default v-else>
        <span class="all-del" @click="onClickSearchHistory(-1)">全部删除 </span>
        <span @click="isShow = !isShow">完成</span>
      </template>
    </van-cell>
    <van-cell
      v-for="(item, index) in searchInfo"
      :key="index"
      :title="item"
      @click="onClickSearchHistory(index, item)"
    >
      <template #default v-if="!isShow">
        <van-icon name="close" />
      </template>
    </van-cell>
    <!-- /历史记录 -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: true
    }
  },
  props: {
    searchInfo: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  methods: {
    // 删除历史记录
    onClickSearchHistory(index, item) {
      if (!this.isShow) {
        return this.$emit('delSearchHistory', index)
      }
      this.$emit('getSearchList', item)
    }
  }
}
</script>
