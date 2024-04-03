// 商品管理 ---> 属性管理
import request from '@/utils/request';

// 接口地址
const API = {
  // 获取一级分类
  C1_URL: '/admin/product/getCategory1',
  // 获取二级分类
  C2_URL: '/admin/product/getCategory2/',
  // 获取三级分类
  C3_URL: '/admin/product/getCategory3/',
  // 获取属性信息
  ATTR_URL: '/admin/product/attrInfoList/',
  // 添加/修改已有属性
  ADDOREDIT_URL: '/admin/product/saveAttrInfo',
};

// 获取一级分类接口方法
export const reqC1 = () => request.get(API.C1_URL);

// 获取二级分类接口方法
export const reqC2 = (category1Id) => request.get(API.C2_URL + category1Id);

// 获取三级分类接口方法
export const reqC3 = (category2Id) => request.get(API.C3_URL + category2Id);

// 获取属性信息
export const reqAttr = (category1Id, category2Id, category3Id) =>
  request.get(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`);

// 新增/修改方法
export const reqAddOrEditAttr = (data) => {
  request.post(API.ADDOREDIT_URL, data);
};
