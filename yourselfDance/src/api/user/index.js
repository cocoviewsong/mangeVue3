// 管理用户数据相关接口
import request from '@/utils/request';

// // 统一管理接口
// let API = {
//   LOGIN_URL: '/user/login',
//   USERINFO_URL: '/user/info',
// };

// // 暴露请求函数  登录接口方法
// export const reqLogin = (data) => request.post(API.LOGIN_URL, data);

// // 获取用户信息接口方法
// export const reqUserInfo = () => request.get(API.USERINFO_URL);

//  *****************************服务器数据
// 项目用户相关请求地址
let API = {
  LOGIN_URL: '/admin/acl/index/login',
  USERINFO_URL: '/admin/acl/index/info',
  LOGOUT_URL: '/admin/acl/index/logout',
};

// 登录接口
export const reqLogin = (data) => request.post(API.LOGIN_URL, data);

// 用户信息接口
export const reqUserInfo = () => request.get(API.USERINFO_URL);

// 退出登录
export const reqLogout = () => request.post(API.LOGOUT_URL);
