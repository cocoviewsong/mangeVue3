export const constantRoute = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
    meta: {
      title: '登录', // 菜单标题
      hidden: true, // 代表路由标题在菜单中是否隐藏  true 隐藏  false 不隐藏
      icon: 'Promotion',
    },
  },

  // 首页模块
  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/home/Home.vue'),
    meta: {
      title: '首页', // 首页标题
      hidden: false,
      icon: 'House',
    },
  },

  // 数据大屏模块
  {
    name: 'Screen',
    path: '/screen',
    component: () => import('@/views/screen/Screen.vue'),
    meta: {
      title: '数据大屏',
      hidden: false,
      icon: 'Monitor',
    },
  },

  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404/404.vue'),
    meta: {
      title: '404',
      hidden: true,
      icon: 'HelpFilled',
    },
  },
];

// -异步路由
export const asyncRoute = [
  // 权限管理模块
  {
    name: 'Acl',
    path: '/acl',
    component: () => import('@/views/home/Home.vue'),
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock',
    },
    redirect: '/alc/user',
    children: [
      {
        name: 'User',
        path: '/alc/user',
        component: () => import('@/views/acl/user/User.vue'),
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        },
      },
      {
        name: 'Role',
        path: '/alc/role',
        component: () => import('@/views/acl/role/Role.vue'),
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'Avatar',
        },
      },
      {
        name: 'Permission',
        path: '/alc/permission',
        component: () => import('@/views/acl/permission/Permission.vue'),
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Grid',
        },
      },
    ],
  },

  // 商品管理模块
  {
    name: 'Product',
    path: '/product',
    component: () => import('@/views/home/Home.vue'),
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'ShoppingCartFull',
    },
    redirect: '/product/trademark',
    children: [
      {
        name: 'Trademark',
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/Trademark.vue'),
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'Goods',
        },
      },
      {
        name: 'Attr',
        path: '/product/attr',
        component: () => import('@/views/product/attr/Attr.vue'),
        meta: {
          title: '属性管理',
          hidden: false,
          icon: 'Setting',
        },
      },
      {
        name: 'Spu',
        path: '/product/spu',
        component: () => import('@/views/product/spu/Spu.vue'),
        meta: {
          title: 'SPU管理',
          hidden: false,
          icon: 'Search',
        },
      },
      {
        name: 'Sku',
        path: '/product/sku',
        component: () => import('@/views/product/sku/Sku.vue'),
        meta: {
          title: 'SKU管理',
          hidden: false,
          icon: 'Edit',
        },
      },
    ],
  },
];

// -任意路由
export const anyRoute = [
  {
    name: 'Any',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    component: () => import('@/views/404/404.vue'),
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'StarFilled',
    },
  },
];
