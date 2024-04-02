import request from '@/utils/request';

// 品牌管理模块接口地址
let API = {
  // 获取已有品牌接口
  TRADEMARK_URL: '/admin/product/baseTrademark/',
};

// 获取已有品牌的接口方法
export const reqHasTrademark = (page, limit) =>
  request.get(API.TRADEMARK_URL + `${page}/${limit}`);
