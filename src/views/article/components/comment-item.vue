<template>
  <div>
    <van-cell>
      <van-image
        slot="icon"
        round
        width="30"
        height="30"
        style="margin-right: 10px"
        :src="comment.aut_photo"
      />
      <span style="color: #466b9d" slot="title">{{ comment.aut_name }}</span>
      <div slot="label">
        <p style="color: #363636">{{ comment.content }}</p>
        <p>
          <span style="margin-right: 10px">{{ commentDesc(comment) }}</span>
          <van-button
            size="mini"
            type="default"
            @click="$emit('reply-click', comment)"
            >回复 {{ comment.reply_count }}</van-button
          >
        </p>
      </div>
      <!-- 评论回复 -->
      <!-- /评论回复 -->
      <van-icon slot="right-icon" name="good-job-o">赞</van-icon>
    </van-cell>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  data() {
    return {
      isReplyShow: true
    }
  },
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    commentDesc(item) {
      const relativeTime = dayjs(item.pubdate).fromNow()
      return relativeTime
    }
  }
}
</script>

<style></style>
