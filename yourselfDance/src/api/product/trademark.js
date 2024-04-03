import request from '@/utils/request';

// 品牌管理模块接口地址
let API = {
  // 获取已有品牌接口
  TRADEMARK_URL: '/admin/product/baseTrademark/',
  // 添加品牌接口
  ADDTRADEMARK_URL: '/admin/product/baseTrademark/save',
  // 修改已有品牌接口
  UPDATETRADEMARK_URL: '/admin/product/baseTrademark/update',
  // 删除已有品牌数据
  DELETE_URL: '/admin/product/baseTrademark/remove/',
};

// 获取已有品牌的接口方法
export const reqHasTrademark = (page, limit) =>
  request.get(API.TRADEMARK_URL + `${page}/${limit}`);

// 添加品牌与修改品牌
export const reqAddOrUpdateTrademark = (data) => {
  // 修改品牌函数
  if (data.id) {
    return request.put(API.UPDATETRADEMARK_URL, data);
  } else {
    // 添加品牌函数
    return request.post(API.ADDTRADEMARK_URL, data);
  }
};

// 删除某个已有品牌
export const reqDeleteTrademark = (id) => request.delete(API.DELETE_URL + id);
