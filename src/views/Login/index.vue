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

    <van-form class="form" ref="form" @submit="login">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span
        ></template>
      </van-field>
      <van-field
        v-model="code"
        name="[/{9}/]"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span
        ></template>
        <template #right-icon>
          <van-count-down
            v-if="isShowCountDown"
            :time="3 * 1000"
            @finish="isShowCountDown = false"
          />
          <van-button
            v-else
            class="code-btn"
            size="mini"
            round
            @click="sendCode"
            >发送验证码</van-button
          ></template
        ></van-field
      >
      <!-- 登录按钮 -->
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendCode } from '@/api/user'
import { mobileRules, codeRules } from './Rules'
export default {
  name: 'login',
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCountDown: false
    }
  },
  methods: {
    backToPrePage() {
      this.$router.back()
    },
    async sendCode() {
      try {
        await this.$refs.form.validate('mobile')
        await sendCode(this.mobile)
        this.isShowCountDown = true
      } catch (error) {
        if (!error.response) {
          this.$toast.fail('请输入手机号')
        } else {
          const status = error.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(error.response.data.message)
          }
        }
      }
    },
    async login() {
      this.$toast.loading({
        message: '稍作等待，正在加载',
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        // 存储对象
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功')
        // 跳转页面
        this.$router.push('/profile')
      } catch (error) {
        const status = error.response.status
        let message = '登录错误，请刷新一下'
        if (status === 400) {
          message = error.response.data.message
        }
        this.$toast.fail(message)
        // switch (status) {
        //   case 400:
        //     this.$toast.fail(error.response.data.message)
        //     break
        //   case 507:
        //     this.$toast.fail('登录错误，请刷新一下')
        //     break
        //   default:
        //     this.$toast.fail('登录错误，请刷新一下')
        //     break
        // }
      }
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
