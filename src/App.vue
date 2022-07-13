<template>
  <div>
    <h1>黑马头条</h1>
    <span class="toutiao toutiao-dianzan"></span>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <div class="login">登录</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
// 移动端适配
// 1. rem动态
//   - amfe-flexible
//   - 不管处于什么分辨率, 1rem始终是 1/10视口大小

// 2. 将px --> rem
//  - postcss-pxtorem
//  - vant官网
//  - 版本是5.1.1
</script>

<style>
.login {
  width: 694px;
  height: 88px;
  background-color: #6db4fb;
  border-radius: 10px;
  margin: 0 auto;
  text-align: center;
  line-height: 88px;
  color: #ffff;
}
</style>
