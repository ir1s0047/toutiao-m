<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="backToPrePage"
      title="黑马头条"
      fixed
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载完成-文章详情 -->
      <div class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title" style="padding-top: 60px">
          {{ article.title }}
        </h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ articleDesc }}
          </div>
          <van-button
            class="follow-btn"
            round
            size="small"
            v-if="article.is_followed"
            @click="onFollow"
            loading:followLoading
            >已关注</van-button
          >
          <van-button
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            v-else
            @click="onFollow"
            loading:followLoading
            >关注</van-button
          >
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>
      </div>

      <!-- 文章评论 -->
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
        <commentItem
          v-for="(item, index) in commentListInfo"
          :key="index"
          :comment="item"
          @reply-click="onReplyShow"
        ></commentItem>
      </van-list>
      <!-- /文章评论 -->

      <!-- /底部区域 -->
      <!-- /加载完成-文章详情 -->
      <div class="article-bottom">
        <van-button
          class="comment-btn"
          type="default"
          round
          size="small"
          @click="postCommentIsShow = !postCommentIsShow"
          >写评论</van-button
        >
        <van-icon color="#777" name="comment-o" :badge="article.comm_count" />
        <CollectArticle
          :articleId="article.art_id"
          v-model="article.is_collected"
        />
        <LikeArticle :articleId="article.art_id" v-model="article.attitude" />
        <van-icon color="#777" name="share" @click="showShare = true" />
        <van-share-sheet
          v-model="showShare"
          title="立即分享给好友"
          :options="options"
          @select="onSelect"
        />
      </div>
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
      <!-- 回复评论弹出层 -->
      <van-popup
        v-model="isReplyShow"
        position="bottom"
        :style="{ height: '90%' }"
      >
        <comment-reply
          :comment="currentComment"
          :articleId="id"
          :articleId1="currentComment"
          v-model="article.attitude"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import dayjs from '@/utils/dayjs'
import './github-markdown.css'
import CollectArticle from './components/collectArticle'
import LikeArticle from './components/likeArticle'
import commentItem from './components/comment-item'
import commentReply from './components/comment-reply'
import {
  getArticleById,
  addFollow,
  deleteFollow,
  getComments,
  addComments
} from '@/api'

export default {
  data() {
    return {
      article: [],
      articleId: '',
      commentListInfo: [],
      showShare: false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' }
      ],
      loading: false,
      finished: false,
      error: false,
      offset: null,
      limit: 10,
      show: '',
      postCommentIsShow: false,
      message: '',
      currentComment: {},
      isReplyShow: false,
      id: this.$route.query.id
    }
  },
  components: {
    CollectArticle,
    LikeArticle,
    commentItem,
    commentReply
  },
  methods: {
    onReplyShow(comment) {
      // 将子组件中传给我评论对象存储到当前组件
      this.currentComment = comment
      // console.log(comment)

      // 展示评论回复弹层
      this.isReplyShow = true
    },
    // 文章详情评论区
    async onLoad() {
      try {
        const { data } = await getComments({
          type: 'a',
          source: this.$route.query.id,
          offset: this.offset,
          limit: this.limit
        })
        const { results } = data.data
        this.commentListInfo.push(...results)
        this.loading = false
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
    // 返回上一页
    backToPrePage() {
      this.$router.go(-1)
    },
    // 获取文章详情
    async getArticleById() {
      const res = await getArticleById(this.$route.query.id)
      this.id = this.$route.query.id
      console.log('文章详情', res)
      this.article = res.data.data
      console.log('article', this.article)
    },
    // 关注功能
    async onFollow() {
      this.followLoading = true
      // 开启按钮的 loading 状态
      this.isFollowLoading = true

      try {
        // 如果已关注，则取消关注
        const authorId = this.article.aut_id
        if (this.article.is_followed) {
          await deleteFollow(authorId)
        } else {
          // 否则添加关注
          await addFollow(authorId)
        }

        // 更新视图
        this.article.is_followed = !this.article.is_followed
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }

      // 关闭按钮的 loading 状态
      this.isFollowLoading = false
      this.followLoading = false
    },
    // 分享组件
    onSelect(option) {
      Toast(option.name)
      this.showShare = false
    },
    // 时间格式化
    commentDesc(item) {
      const relativeTime = dayjs(item.pubdate).fromNow()
      return relativeTime
    },
    // 发布评论
    async pushComment() {
      try {
        const { data } = await addComments({
          target: this.article.art_id,
          content: this.message,
          art_id: null
        })
        console.log('发布评论内容', data)
        this.commentListInfo.unshift(data.data.new_obj)
        // console.log('发布评论内容', this.commentListInfo)
        this.postCommentIsShow = false
        this.$toast.success('发布成功')
        this.message = ''
      } catch (err) {
        this.$toast.fail('发布失败')
        console.log(err)
      }
    }
  },
  created() {
    this.getArticleById()
  },
  computed: {
    articleDesc() {
      const art = this.article
      const relativeTime = dayjs(art.pubdate).fromNow()
      return relativeTime
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  .messageBox {
    display: flex;
    align-items: center;
    .van-button--default {
      color: #6ba3d8;
      font-size: 14px;
      border: 0.02667rem solid #fff;
    }
  }
  .page-nav-bar {
    background-color: #3296fa;
    :deep(.van-nav-bar__title) {
      color: #fff;
    }
    :deep(.van-icon-arrow-left:before) {
      color: #fff;
    }
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
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
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
