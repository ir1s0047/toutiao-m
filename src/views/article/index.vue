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
        <van-cell
          v-for="(item, index) in commentListInfo"
          :key="index"
          :comment="item"
        >
          <van-image
            slot="icon"
            round
            width="30"
            height="30"
            style="margin-right: 10px"
            :src="item.aut_photo"
          />
          <span style="color: #466b9d" slot="title">{{ item.aut_name }}</span>
          <div slot="label">
            <p style="color: #363636">{{ item.content }}</p>
            <p>
              <span style="margin-right: 10px">{{ commentDesc(item) }}</span>
              <van-button size="mini" type="default">回复</van-button>
            </p>
          </div>
          <van-icon slot="right-icon" name="like-o" />
        </van-cell>
        <!-- <van-cell v-for="(item, index) in commentListInfo" :key="index">
          {{ item.content }}
        </van-cell> -->
      </van-list>
      <!-- /文章评论 -->

      <!-- /底部区域 -->
      <!-- /加载完成-文章详情 -->
      <div class="article-bottom">
        <van-button class="comment-btn" type="default" round size="small"
          >写评论</van-button
        >
        <van-icon color="#777" name="comment-o" :badge="article.comm_count" />
        <CollectArticle
          :articleId="article.art_id"
          v-model="article.is_collected"
        />
        <LikeArticle :articleId="article.art_id" v-model="article.attitude" />
        <van-icon color="#777" name="share" @click="showShare = true">
          <van-share-sheet
            v-model="showShare"
            title="立即分享给好友"
            @select="onSelect"
        /></van-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import dayjs from '@/utils/dayjs'
import './github-markdown.css'
import CollectArticle from './components/collectArticle'
import LikeArticle from './components/likeArticle'
import { getArticleById, addFollow, deleteFollow, getComments } from '@/api'

export default {
  data() {
    return {
      article: [],
      articleId: '',
      commentListInfo: [],
      showShare: false,
      loading: false,
      finished: false,
      error: false,
      offset: null,
      limit: 10
    }
  },
  components: {
    CollectArticle,
    LikeArticle
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getComments({
          type: 'a',
          source: this.$route.query.id,
          offset: this.offset,
          limit: this.limit
        })
        console.log(data)
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
    backToPrePage() {
      this.$router.go(-1)
    },
    async getArticleById() {
      const res = await getArticleById(this.$route.query.id)
      console.log(res)
      this.article = res.data.data
      console.log(this.article)
    },
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
    onSelect(option) {
      Toast(option.name)
      console.log(option)
      this.showShare = false
    },
    commentDesc(item) {
      const relativeTime = dayjs(item.pubdate).fromNow()
      return relativeTime
    }
  },
  created() {
    this.getArticleById()
    this.onLoad()
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
