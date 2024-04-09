// 路由鉴权
import router from '@/router';
import setting from './setting';
// 进度条
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
// 对加载进度的小球进行隐藏
nprogress.configure({ showSpinner: false });

// 用户数据
import pinia from './stores';
import useUserStore from './stores/modules/user';
let userStore = useUserStore(pinia);

// 全局守卫---路由切换会触发的钩子
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  document.title = `${setting.title} I ${to.meta.title} `;
  // to:去哪里
  // from:哪里来
  // next:路由放行函数
  nprogress.start();

  // 判断用户是否登录
  let token = userStore.token;
  let userName = userStore.userName;

  if (token) {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (userName) {
        next();
      } else {
        try {
          await userStore.userInfo();
          next({ ...to });
        } catch (error) {
          // token过期  / 用户修改了本地存储

          /* 
            不知道为啥刷新会退出登录
          */

          await userStore.userLogOut();
          next({ path: '/login', query: { redirect: to.path } });
        }
      }
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next({ path: '/login', query: { redirect: to.path } });
    }
  }
});

// 全局后置守卫
router.afterEach((to, from) => {
  nprogress.done();
});
