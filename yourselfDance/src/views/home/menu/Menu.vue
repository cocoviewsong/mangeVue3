<template>
  <template v-for="(item, index) in menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item
        v-if="!item.meta.hidden"
        @click="goRoute"
        :index="item.path"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 有且只有一个子路由 -->
    <!-- <template v-if="item.children && item.children.length === 1">
      <el-menu-item
        v-if="!item.children[0].meta.hidden"
        @click="goRoute"
        :index="item.children[0].path"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template> -->

    <!-- 有多个子路由 -->
    <el-sub-menu
      v-if="item.children && item.children.length >= 1"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>

      <!-- 递归组件 -->
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup>
import { useRouter } from 'vue-router';

// 获取传递过来的路由数组
defineProps(['menuList']);

let router = useRouter();

// 路由跳转
function goRoute(vc) {
  router.push(vc.index);
}
</script>

<!-- 递归组件 -->
<script>
export default {
  name: 'Menu',
};
</script>

<style scoped lang="scss">
li {
  line-height: 13px;
}
</style>
