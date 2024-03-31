import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// easy ___ 忽略 这个文件
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn, // 国际化配置
});
app.mount('#app');
