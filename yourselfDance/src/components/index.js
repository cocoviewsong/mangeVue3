// 引入项目中全部的全局组件
import SvgIcon from '@/components/SvgIcon/index.vue';
import Pagination from '@/components/Pagination/index.vue';
import Category from './Category.vue';

// 引入element-plus 提供的图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 全局对象
const allGlobalComponent = { SvgIcon, Pagination, Category };

// 对外暴露插件对象
export default {
  // 务必叫做install 方法
  install(app) {
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      // 把所有组件注册为全局组件
      app.component(key, allGlobalComponent[key]);
    });
    // 将element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
