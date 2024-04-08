# yourselfdance

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### **Tabbar 组件暗黑主题切换的第二个选择**

#### 已解决 放在 APP 组件中 数据放仓库里面

<!-- //- 气泡卡片 -->
<el-popover title="主题设置" :width="200" trigger="hover">
<!-- 表单组件 -->
<el-form>
<el-form-item label="主题颜色">
<!-- 颜色选择器 -->
<el-color-picker
              size="small"
              v-model="color"
              show-alpha
              :predefine="predefineColors"
            />
</el-form-item>
<!-- 暗黑模式 -->
<el-form-item label="暗黑模式">
<el-switch
v-model="dark"
size="small"
active-icon="Moon"
inactive-icon="Sunny"
@change="changeDark"
/>
</el-form-item>
</el-form>
<template #reference>
<el-button
icon="Operation"
circle
size="small"
title="设置"
@click="drawer = true" ></el-button>
</template>
</el-popover>
