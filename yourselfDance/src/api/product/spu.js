import request from '@/utils/request';

const API = {
  // 获取当前页面数据
  HASSPU_URL: '/admin/product/',
};

// 获取对应分类的数据
export const reqHasSpu = (page, limit, category3Id) =>
  request.get(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`);
