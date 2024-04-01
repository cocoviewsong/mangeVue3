import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// easy ___ 忽略 这个文件
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// svg插件需要配置的代码
import 'virtual:svg-icons-register';

// 引入模板的全局样式
import '@/styles/index.scss';

import router from './router';
import App from '@/App.vue';
// 引入路由鉴权
import '@/permisstion.js';

// 引入仓库
import pinia from './stores';

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn, // 国际化配置
});

// 引入自定义插件对象:注册整个项目的全局组件
import globalComponents from '@/components';
app.use(globalComponents);

// 注册路由
app.use(router);
// 获取开发环境的env信息
// console.log(import.meta.env);

app.use(pinia);

app.mount('#app');
