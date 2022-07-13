<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar
      class="navbar"
      title="登录"
      left-arrow
      @click-left="backToPrePage"
    >
      <template #left>
        <van-icon name="cross"></van-icon>
      </template>
    </van-nav-bar>

    <!-- 手机号码 -->

    <!-- 登录按钮 -->
    <van-form class="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="[{ required: true, message: '请输入手机号' }]"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span
        ></template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span
        ></template>
        <template #right-icon>
          <van-button class="code-btn" size="mini"
            >发送验证码</van-button
          ></template
        ></van-field
      >
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit" @click="login"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'login',
  data() {
    return {
      mobile: '',
      code: ''
    }
  },
  methods: {
    backToPrePage() {
      this.$router.back()
    },
    async login() {
      const res = await login(this.mobile, this.code)
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}
// 表单域样式
.form {
  :deep(.van-field__label) {
    flex: 1;
  }
  :deep(.van-cell__value) {
    flex: 20;
  }
  .toutiao {
    font-size: 0.49333rem;
  }
  .code-btn {
    padding: 0 10px;
    background-color: #ededed;
    color: #666;
    border-radius: 25px;
  }
}
</style>
