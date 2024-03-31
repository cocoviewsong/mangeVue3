export const constantRoute = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    // 登录成功后展示数据的路由
    name: 'home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index.vue'),
  },
  {
    name: 'any',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    component: () => import('@/views/404/index.vue'),
  },
];
