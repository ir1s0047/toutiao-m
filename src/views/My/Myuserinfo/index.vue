<template>
  <div class="all">
    <div class="title">
      <van-nav-bar title="个人信息" left-arrow @click-left="titleOnClickLeft" />
    </div>
    <van-cell class="body">
      <van-cell title="头像" is-link style="height: 37px; padding: 0px">
        <van-image
          round
          width="30"
          height="30"
          :src="userinfo.photo"
          @click="imageClickFn"
        />
        <!-- file选择框 -->
        <input
          type="file"
          hidden
          ref="iptfile"
          v-show="false"
          @change="onFileChange"
        />
      </van-cell>
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="userinfo.name"
      @click="nameshow = !nameshow"
    />
    <van-cell
      title="性别"
      is-link
      :value="userinfo.gender ? '女' : '男'"
      @click="isShowUpdateGender = !isShowUpdateGender"
    />
    <van-cell
      title="生日"
      is-link
      :value="userinfo.birthday"
      @click="birthdayshow = !birthdayshow"
    />
    <!-- 昵称弹出层 -->
    <van-popup v-model="nameshow" position="bottom" :style="{ height: '40%' }">
      <van-nav-bar
        title="更新昵称"
        left-text="取消"
        right-text="提交"
        @click-left="onClickLeft"
        @click-right="onClickRight" />
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
    /></van-popup>
    <!-- 编辑性别弹层 -->
    <van-popup v-model="isShowUpdateGender" position="bottom">
      <update-gender
        v-if="isShowUpdateGender"
        v-model="userinfo.gender"
        @close="isShowUpdateGender = false"
      />
    </van-popup>
    <!-- 编辑昵称弹层 -->
    <!-- 生日弹出框 -->
    <van-popup
      v-model="birthdayshow"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="clickRight"
        @cancel="clickLeft"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
    /></van-popup>
  </div>
</template>

<script>
import dayJs from 'dayjs'
import updateGender from './update-gender.vue'
import { takeUserInfo, updateUserName, updateUserPhotoAPI } from '@/api/user'
export default {
  data() {
    return {
      nameshow: false, // 昵称弹出框
      birthdayshow: false,
      message: '', // 昵称输入框v-model属性
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2000, 4, 7),
      userinfo: {},
      isShowUpdateGender: false
    }
  },
  components: { updateGender },
  methods: {
    // 返回上一页
    titleOnClickLeft() {
      this.$router.go(-1)
    },
    // 更换头像
    async onFileChange(e) {
      if (e.target.files.length === 0) return
      console.log(e.target.files[0])
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0])

      const res = await updateUserPhotoAPI(theFd)
      console.log(res)
      this.userinfo.photo = res.data.data.photo
    },
    // 点击图片
    imageClickFn() {
      this.$refs.iptfile.click() // js模拟标签事件触发
    },
    // 取消
    onCancel() {
      this.isShowUpdateGender = false
    },
    // 昵称
    onClickLeft() {
      this.nameshow = false
    },
    async onClickRight() {
      try {
        const data = await updateUserName({
          name: this.message
        })
        console.log(data)
        this.nameshow = false
        this.$toast('修改成功')
        this.userinfo.name = this.message
      } catch (err) {
        this.$toast('修改失败')
        console.log(err)
      }
    },
    // 日期
    async clickRight() {
      try {
        const data = await updateUserName({
          birthday: dayJs(this.currentDate).format('YYYY-MM-DD')
        })
        console.log(data)
        this.birthdayshow = false
        this.$toast('修改成功')
        this.userinfo.birthday = dayJs(this.currentDate).format('YYYY-MM-DD')
      } catch (err) {
        this.$toast('修改失败')
        console.log(err)
      }
    },
    clickLeft() {
      this.birthdayshow = false
    },
    async takeUserInfo() {
      const { data } = await takeUserInfo()
      console.log(data.data)
      const res = data.data
      this.userinfo = res
      console.log(this.userinfo)
    }
  },
  created() {
    this.takeUserInfo()
  }
}
</script>

<style lang="less" scoped>
.all {
  height: 1334px;
  background-color: #f5f7f9;
  .title {
    .van-nav-bar {
      background-color: #3296fa;
      :deep(.van-nav-bar__title) {
        color: #fff;
      }
      :deep(.van-icon) {
        color: #fff;
      }
    }
  }
}
</style>
