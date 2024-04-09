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

**绝对单位**
px：像素
pt：点，1 pt = 1 / 72 in
pc：派，1 pc = 12 pt
mm：毫米
cm：厘米
in:英寸，1 in = 96px = 2.54cm

**相对单位**
%：百分比，相对父节点尺寸
em：M 的宽度，相对当前节点字体
rem：M 的宽度，相对根结点字体
ch：0 的宽度，相对当前节点字体
ex：x 的宽度，相对当前节点字体
vw：1%视窗宽度，相对视窗
vh：1%视窗高度，相对视窗
vmin：vw/vh 最小者，相对视窗
vmax：vw/vh 最大者，相对视窗

- 视窗宽高在 JS 中分别相应 window.innerWdith 与 window.innerHeight

### 处理抖动

100vw 是视窗宽度，100%是内容宽度，那 100vw - 100%就是滚动条宽度了，声明 padding-right 用于保留滚动条出现的位置，这样滚动条出不出现都不会让网页抖动
