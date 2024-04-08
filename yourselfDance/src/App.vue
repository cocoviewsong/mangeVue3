<template>
  <div class="test">
    <RouterView></RouterView>
    <!-- //! 选择二  用抽屉 -->
    <el-drawer v-model="homeStore.drawer">
      <template #header>
        <h4>主题设置</h4>
      </template>
      <template #default>
        <!-- 表单组件 -->
        <el-form>
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="主题颜色"> </el-form-item>
            <!-- 颜色选择器 -->
            <el-color-picker
              size="small"
              v-model="color"
              show-alpha
              @change="setColor"
            />
          </div>
          <!-- 暗黑模式 -->
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="暗黑模式"></el-form-item>
            <el-switch
              v-model="dark"
              size="small"
              active-icon="Moon"
              inactive-icon="Sunny"
              @change="changeDark"
            />
          </div>
        </el-form>
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="App">
import { ref } from 'vue';
import useHomeStore from '@/stores/modules/setting.js';

const homeStore = useHomeStore();

// *颜色选择器
const color = ref('rgba(255, 69, 0, 0.68)');
const setColor = () => {
  // .通知js修改根节点的样式对象的属性
  const html = document.documentElement;
  // .设置 css 变量
  html.style.setProperty('--el-color-primary', color.value);
  html.style.setProperty('--el-color-danger', color.value);
  html.style.setProperty('--el-color-warning', color.value);
  html.style.setProperty('--el-color-success', color.value);
};

// *暗黑模式切换
// .显示与隐藏对话框
const dark = ref(false);
const changeDark = () => {
  // .获取HTML根节点
  let html = document.documentElement;
  dark.value ? (html.className = 'dark') : (html.className = '');
};
const changeDrawer = () => {
  drawer.value = true;
};
</script>

<style scoped lang="scss">
.test {
  h1 {
    color: $base-color;
  }
}
</style>
