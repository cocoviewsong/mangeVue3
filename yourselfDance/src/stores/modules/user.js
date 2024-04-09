// 创建用户相关的小仓库
import { defineStore } from 'pinia';

// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';

// 引入路由(常量路由)
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';

import cloneDeep from 'lodash/cloneDeep';

import router from '@/router';

// *用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute, routes) {
  return asnycRoute.filter((item) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes);
      }
      return true;
    }
  });
}

// 创建用户小仓库
let useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: () => {
    return {
      token: localStorage.getItem('TOKEN') || '', // 用户唯一标识
      menuRouter: constantRoute, // 仓库存储生成菜单需要的数组
      userName: '',
      avatar: '',
      buttons: [],
    };
  },
  //   异步|逻辑
  actions: {
    // 用户登录的方法
    async userLogin(data) {
      // 登录请求
      let result = await reqLogin(data);

      // 登录请求成功  200
      if (result.code === 200) {
        // piana 存储 token
        this.token = result.data;

        // 本地存储
        localStorage.setItem('TOKEN', JSON.stringify(result.data));

        // 保证当前async函数返回一个成功的promise
        return 'ok';
      } else {
        console.log('密码错误');
        // 返回一个失败的promise
        return Promise.reject(new Error('登录失败'));
      }
      // 登录请求失败  201
    },

    // 获取用户信息
    async userInfo() {
      // 存储到仓库中
      let result = await reqUserInfo();
      console.log(result.data.routes);

      if (result.code === 200) {
        this.userName = result.data.name;
        this.avatar = result.data.avatar;
        this.buttons = result.data.buttons;

        // .计算当前用户需要展示的路由
        let userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes
        );
        // .菜单需要的数据整理完毕
        this.menuRouter = [...constantRoute, ...userAsyncRoute, ...anyRoute];
        // .目前路由器管理的只有常量路由:用户计算完毕的路由需要动态追加
        [...userAsyncRoute, anyRoute].forEach((route) => {
          router.addRoute(route);
        });

        return 'ok';
      } else {
        return Promise.reject(new Error('错误'));
      }
    },

    // 退出登录 清空数据  本地 + pinia
    async userLogOut() {
      let result = await reqLogout();
      console.log(result);
      if (result.code === 200) {
        this.token = '';
        this.userName = '';
        this.avatar = '';
        localStorage.removeItem('TOKEN');
        return 'ok';
      } else {
        return Promise.reject(new Error('退出失败'));
      }
    },
  },
  //   计算属性
  getters: {},
});

export default useUserStore;
