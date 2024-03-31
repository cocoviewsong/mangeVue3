<template>
  <!-- 测试svg图标使用 -->
  <!--  svg:图标外层容器节点,内部需要与use标签结合使用  -->
  <svg :style="{ width, height }">
    <!-- 属性值必须以  #inco-图标名字 -->
    <!-- use标签的fill属性,可以进行图标颜色的设置 -->
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup>
// 接收父组件传递过来的参数
defineProps({
  // xlink:href 属性值的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  // 提供使用的图标的名字
  name: String,
  // 接收父组件传递的颜色
  color: {
    type: String,
    default: 'red',
  },
  // 接收父组件传递过来的图标的宽度
  width: {
    type: String,
    default: '30px',
  },
  // 接收父组件传递过来的图标的高度
  height: {
    type: String,
    default: '30px',
  },
});
</script>

<style scoped lang="scss"></style>
