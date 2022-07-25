<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : `暂无回复`
      "
    >
    </van-nav-bar>
    <CommentItem :comment="comment"></CommentItem>
    <!-- 评论的回复列表 -->
    <van-cell title="全部回复"></van-cell>
    <!-- 全部回复列表 -->
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error="error"
        error-text="加载失败，请重试"
        @load="onLoad"
      >
        <!-- <van-cell
          v-for="(item, index) in commentListInfo"
          :key="index"
          :comment="item"
        > -->
        <van-cell v-for="(item, index) in commentListInfo" :key="index">
          <van-image
            slot="icon"
            round
            width="30"
            height="30"
            style="margin-right: 10px"
            :src="comment.aut_photo"
          />
          <span style="color: #466b9d" slot="title">{{ item.aut_name }}</span>
          <div slot="label">
            <p style="color: #363636">{{ item.content }}</p>
            <p>
              <span style="margin-right: 10px">{{ commentDesc(item) }}</span>
              <van-button
                size="mini"
                type="default"
                @click="$emit('reply-click', item)"
                >回复 {{ item.reply_count }}</van-button
              >
            </p>
          </div>
          <!-- 评论回复 -->
          <!-- /评论回复 -->
          <van-icon
            :color="value === 1 ? 'red' : ''"
            :name="value === 1 ? 'good-job' : 'good-job-o'"
            :class="{ collected: value }"
            @click="ClickNice"
            :loading="loading"
          />
        </van-cell>
      </van-list>
    </div>
    <!-- 底部回复按钮 -->
    <div>
      <van-tabbar style="background-color: #ff69b4">
        <van-button
          type="primary"
          size="large"
          round
          style="height: 38px; width: 300px"
          @click="postCommentIsShow = !postCommentIsShow"
          >评论</van-button
        ></van-tabbar
      >
      <!-- 发布评论 -->
      <van-popup
        v-model="postCommentIsShow"
        position="bottom"
        :style="{ height: '120px' }"
      >
        <div class="messageBox" style="padding: 16px 0 16px 16px">
          <van-field
            v-model.trim="message"
            rows="2"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入留言"
            show-word-limit
            style="background-color: #f5f7f9; width: 298px; height: 88px"
          />
          <van-button
            type="default"
            :disabled="!message.length"
            @click="pushComment"
            >发布</van-button
          >
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import { getComments, addComments, Likings, UnLikings } from '@/api/index'
import CommentItem from './comment-item'
// import CommentList from './commentList'
export default {
  name: 'CommentReply',
  components: {
    CommentItem
    // CommentList
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    },
    articleId1: {
      type: [String, Number, Object],
      required: true
    },
    type: {
      type: String,
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    },
    value: {
      // type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      offset: null,
      limit: 10,
      commentListInfo: [],
      postCommentIsShow: false,
      message: ''
    }
  },
  methods: {
    // 获取回复的评论列表
    async onLoad() {
      try {
        const { data } = await getComments({
          type: 'c',
          source: this.comment.com_id,
          offset: this.offset,
          limit: this.limit
        })
        // console.log(data.data)
        const { results } = data.data
        this.commentListInfo.push(...results)
        this.loading = false
        console.log(this.commentListInfo)
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
    // 发布评论
    async pushComment() {
      try {
        const { data } = await addComments({
          target: this.comment.com_id,
          content: this.message,
          art_id: this.articleId
        })
        console.log('回复评论内容', data)
        this.commentListInfo.unshift(data.data.new_obj)
        console.log(this.commentListInfo)
        this.postCommentIsShow = false
        this.$toast.success('发布成功')
        this.message = ''
      } catch (err) {
        this.$toast.fail('发布失败')
        console.log(err)
      }
    },
    // 点赞功能
    async ClickNice() {
      // 开始请求
      this.loading = true
      try {
        let status = -1
        // 是否收藏
        if (this.value === 1) {
          // 父组件 传递articleId
          await UnLikings(this.articleId1.art_id)
        } else {
          await Likings(this.articleId1.art_id)
          status = 1
        }
        // 更新视图
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '成功点赞' : '取消点赞')
      } catch (err) {
        this.$toast('操作失败，请重试')
        console.log(err)
      }
      // 请求结束
      this.loading = false
    },
    commentDesc(item) {
      const relativeTime = dayjs(item.pubdate).fromNow()
      return relativeTime
    }
  }
}
</script>

<style scoped lang="less">
:deep(.van-button) {
  margin: auto auto;
  background-color: #fff;
  border-color: #fff;
  color: #333;
}
.messageBox {
  display: flex;
  align-items: center;
  .van-button--default {
    color: #6ba3d8;
    font-size: 14px;
    border: 0.02667rem solid #fff;
  }
}
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 88px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 282px;
    height: 46px;
    border: 2px solid #eeeeee;
    font-size: 30px;
    line-height: 46px;
    color: #a7a7a7;
  }
}
</style>
