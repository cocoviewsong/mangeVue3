// 管理用户数据相关接口
import request from '@/utils/request';

// 统一管理接口
let API = {
  LOGIN_URL: '/user/login',
  USERINFO_URL: '/user/info',
};

// 暴露请求函数  登录接口方法
export const reqLogin = (data) => request.post(API.LOGIN_URL, data);

// 获取用户信息接口方法
export const reqUserInfo = () => request.get(API.USERINFO_URL);
