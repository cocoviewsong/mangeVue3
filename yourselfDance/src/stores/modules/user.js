// 创建用户相关的小仓库
import { defineStore } from 'pinia';

// 引入接口
import { reqLogin } from '@/api/user';

// 创建用户小仓库
let useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: () => {
    return {
      token: localStorage.getItem('TOKEN') || '', // 用户唯一标识
    };
  },
  //   异步|逻辑
  actions: {
    // 用户登录的方法
    async userLogin(username, password) {
      // 登录请求
      let result = await reqLogin(username);
      console.log(result);
      // 登录请求成功  200
      if (result[0].password === password && result[0].username === username) {
        // piana 存储一下token
        // 由于 pinia 其实利用 js 对象
        this.token = result[0].token;
        console.log('密码正确');

        // 本地存储
        localStorage.setItem('TOKEN', JSON.stringify(result[0].token));

        // 保证当前async函数返回一个成功的promise
        return 'ok';
      } else {
        console.log('密码错误');
        // 返回一个失败的promise
        return Promise.reject(new Error('登录失败'));
      }
      // 登录请求失败  201
    },
  },
  //   计算属性
  getters: {},
});

export default useUserStore;
