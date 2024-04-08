<template>
  <div class="home__container">
    <!-- 左侧菜单 -->
    <div
      class="home__container__silder"
      :class="{ fold: homeStore.fold ? true : false }"
    >
      <!-- 顶部 logo -->
      <div
        class="home__container__logo flex-center-2"
        v-if="setting.logoHidden"
      >
        <img :src="setting.logo" alt="pinia" />
        <p v-if="!homeStore.fold">{{ setting.title }}</p>
      </div>

      <!-- 展示菜单 -->
      <!-- 滚动条 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="homeStore.fold ? true : false"
          background-color="#333"
          text-color="#fff"
          active-text-color="#f7777f"
          :default-active="route.path"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRouter"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 顶部导航 -->
    <div
      class="home__container__tabbar"
      :class="{ fold: homeStore.fold ? true : false }"
    >
      <!-- //- 子组件导航栏 -->
      <Tabbar></Tabbar>
    </div>

    <!-- 内容展示区域 -->
    <div
      class="home__container__main"
      :class="{ fold: homeStore.fold ? true : false }"
    >
      <RouterView v-slot="{ Component }">
        <Transition name="fade">
          <component :is="Component" v-if="flag"></component>
        </Transition>
      </RouterView>
      <div v-if="route.path === '/'">
        <el-card>
          <div class="flexBox">
            <img :src="userStore.avatar" alt="用户头像" />
            <div>
              <h2 style="color: #343a40; font-size: 24px; font-weight: 500">
                {{ getTimeNormal() }}好,{{
                  userStore.userName ? userStore.userName : 'admin(超级管理员)'
                }}
              </h2>
              <p style="color: #868e96; font-size: 18px; font-weight: 500">
                &mdash;&mdash;&mdash;&mdash;{{ setting.title }}
              </p>
            </div>
          </div>
        </el-card>
        <div style="text-align: center; background-size: cover">
          <SvgIcon
            name="yahoo"
            color="#333"
            width="600px"
            height="450px"
          ></SvgIcon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入设置 标题 | logo 的文件
import { watch, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';

import setting from '@/setting.js';
import Menu from './menu/Menu.vue';
import Tabbar from '@/views/home/tabbar/Tabbar.vue';
import { getTimeNormal } from '@/utils/time.js';

// 获取用户相关的小仓库数据
import useUserStore from '@/stores/modules/user';
import useHomeStore from '@/stores/modules/setting';

let userStore = useUserStore();
let homeStore = useHomeStore();

// 获取路由对象---通过route.path 获取当前路由 让导航栏保持开启
let route = useRoute();

// 控制当前组件是否销毁重建
let flag = ref(true);

// 监听刷新按钮是否被点击
watch(
  () => homeStore.reload,
  () => {
    flag.value = false;
    nextTick(() => {
      flag.value = true;
    });
  }
);
</script>

<style scoped lang="scss">
@import '@/styles/layout.scss';

.home__container {
  width: 100%;
  height: 100vh;

  &__silder {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    transition: width $animation-time;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
      line-height: 13px;
      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base-menu-min-width;

      .home__container__logo img {
        margin-left: 15px;
      }
    }
  }

  &__logo {
    width: 100%;
    height: $base-menu-logo-height;
    color: #fff;
    padding: 20px;
    padding-top: 26px;

    &.flex-center-2 {
      @include flex-center(15px);
    }

    img {
      width: 24px;
    }
    p {
      font-size: $base-logo-title-fontSize;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    height: $base-tabbar-height;
    width: calc(100% - $base-menu-width);
    transition: all $animation-time;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  &__main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    background-color: #666;
    transition: all $animation-time;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}

.flexBox {
  display: flex;
  align-items: center;
  justify-items: center;
  gap: 20px;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  h2 {
    margin-bottom: 10px;
  }
}

// 路由切换的淡入淡出
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all $animation-time;
}
.fade-enter-to {
  opacity: 1;
}
</style>
