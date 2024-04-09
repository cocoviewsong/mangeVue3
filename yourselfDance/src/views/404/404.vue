<template>
  <div>
    <span>你当前访问的页面不存在!</span>
    <span class="btn">
      <RouterLink to="/">点我返回到首页</RouterLink>
    </span>
  </div>
</template>

<script setup name="404"></script>

<style scoped lang="scss">
div {
  height: 100vh;
  background: #333;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  span {
    color: #ff7777;
    font-size: 30px;
    text-align: center;
  }
  a {
    padding: 10px;
    color: #fff;
    text-decoration: none;
    border: 1px solid #fff;
    border-radius: 5px;
  }
  a:hover {
    color: #ff7777;
  }
  a:active {
    color: #ff7777;
    font-size: 16px;
  }
}
</style>
