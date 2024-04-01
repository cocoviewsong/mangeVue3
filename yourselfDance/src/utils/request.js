// 进行 axios二次封装:使用请求与响应拦截器
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 引入仓库数据
import useUserStore from '@/stores/modules/user.js';

// 利用 axios对象的create方法,创建一个axios实例(其他配置:基础路径,超时时间)
let request = axios.create({
  // 自己写的数据
  baseURL: 'http://rap2api.taobao.org/app/mock/317814',
  // baseURL: import.meta.env.VITE_APP_BASE_API,

  // baseURL: 'http://sph-api.atguigu.cn',
  timeout: 5000, // 超时限制
});

// 给实例添加请求与响应拦截器

let userStore;
// 配置请求拦截器
request.interceptors.request.use((config) => {
  userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token;
  }
  // config配置对象,headers属性---请求头,经常给服务器端携带公共参数
  // 返回配置对象
  return config;
});

// 配置响应拦截器
request.interceptors.response.use(
  (response) => {
    // 简化数据
    return response.data;
  },
  (error) => {
    // ---处理http网络错误

    // 存储网络错误信息
    let message = '';
    // http状态码
    let status = error.response.status;

    switch (status) {
      case 401:
        message = 'TOKEN AFTER';
        break;
      case 403:
        message = 'Please you run';
        break;
      case 404:
        message = '请求地址错误';
        break;
      case 500:
        message = '服务器无了';
        break;
      default:
        message = '寄了';
    }

    // 提示错误信息
    ElMessage({
      type: 'error',
      message,
    });
    return Promise.reject(error);
  }
);

export default request;
