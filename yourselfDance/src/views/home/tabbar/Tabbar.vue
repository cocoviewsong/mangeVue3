<template>
  <div class="tabbar">
    <div class="tabbar__left">
      <el-icon style="margin-right: 10px" @click="changeIcon">
        <component :is="homeStore.fold ? 'Fold' : 'Expand'"></component>
      </el-icon>
      <!-- 面包屑 -->
      <el-breadcrumb separator-icon="ArrowRight">
        <!-- 需要动态展示路由名字与标题 -->
        <el-breadcrumb-item
          v-for="(currentRoute, index) in route.matched"
          :key="index"
          :to="currentRoute.path"
        >
          <div class="flex-center-2">
            <!-- 图标 -->
            <el-icon>
              <component :is="currentRoute.meta.icon"></component>
            </el-icon>
            <span>
              <!-- 面包屑展示匹配路由的标题 -->
              {{ currentRoute.meta.title }}
            </span>
          </div>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabbar__right">
      <el-button
        icon="Refresh"
        circle
        size="small"
        @click="handlerReload"
        title="刷新页面"
      ></el-button>

      <el-button
        icon="FullScreen"
        circle
        size="small"
        @click="fullScreen"
        :title="fullTitle"
      ></el-button>

      <!-- //. 设置按钮 -->
      <el-button
        @click="homeStore.handlerThemeDisplay()"
        icon="Operation"
        circle
        size="small"
        title="设置"
      ></el-button>

      <img :src="userStore.avatar" alt="用户头像" />

      <!-- 下拉菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          <!-- 用户名 -->
          {{ userStore.userName }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import useHomeStore from '@/stores/modules/setting.js';
import useUserStore from '@/stores/modules/user.js';

let full;
let fullTitle = ref('进入全屏');

let homeStore = useHomeStore();
let userStore = useUserStore();

// *获取路由  通过 matched 属性能获取路由元信息
let route = useRoute();
let router = useRouter();

function changeIcon() {
  homeStore.fold = !homeStore.fold;
}

// *进行页面刷新
function handlerReload() {
  homeStore.reload = !homeStore.reload;
}

// *全屏按钮(未处理兼容性)
function fullScreen() {
  // DOM对象的一个属性，可以用来判断全屏状态
  full = document.fullscreenElement;
  if (!full) {
    fullTitle.value = '退出全屏';
    // requestFullscreen 实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    fullTitle.value = '进入全屏';
    // 退出全屏
    document.exitFullscreen();
  }
}

// *退出登录
async function logOut() {
  await userStore.userLogOut();
  router.push({
    path: '/login',
    query: {
      redirect: route.path,
    },
  });
}
</script>

<style scoped lang="scss">
@import '@/styles/layout.scss';

.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    to right,
    #f7777f,
    rgb(150, 154, 154),
    #f7777f
  );

  &__left {
    display: flex;
    align-items: center;
    margin-left: 20px;

    .flex-center-2 {
      @include flex-center(2px);
    }
  }

  &__right {
    display: flex;
    align-items: center;
    margin-right: 20px;

    img {
      border-radius: 50%;
      width: 24px;
      height: 24px;
      margin: 0 10px;
    }
  }
}
</style>
