// 关于：Home组件相关配置仓库
import { defineStore } from 'pinia';

let useHomeStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 控制左侧菜单是否折叠
      reload: false, // 控制刷新效果
    };
  },
});

export default useHomeStore;
