import request from '@/utils/request';

const API = {
  // 获取当前页面数据
  HASSPU_URL: '/admin/product/',
  // 获取全部品牌的数据
  ALLTRADEMARK_URL: '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个品牌的所有图片
  IMAGE_URL: '/admin/product/spuImageList/',
  // 获取某个品牌的销售属性列表
  SPUHASALEATTR_URL: '/admin/product/spuSaleAttrList/',
  // 获取全部销售属性
  ALLSALEATTR_URL: '/admin/product/baseSaleAttrList',
  // 添加一个新的 SPU
  ADDSPU_URL: '/admin/product/saveSpuInfo',
  // 更新已有的 SPU
  UPDATESPU_URL: '/admin/product/updateSpuInfo',
};

// 获取对应分类的数据
export const reqHasSpu = (page, limit, category3Id) =>
  request.get(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`);

// 获取全部 SPU品牌数据
export const reqAllTradeMark = () => request.get(API.ALLTRADEMARK_URL);

// 获取某个品牌的图片
export const reqSpuImageList = (spuId) => request.get(API.IMAGE_URL + spuId);

// 获取某个品牌的销售属性
export const reqSpuHasSaleAttr = (spuId) =>
  request.get(API.SPUHASALEATTR_URL + spuId);

// 获取全部销售属性
export const reqAllSaleAttr = () => request.get(API.ALLSALEATTR_URL);

// 添加一个新的 SPU
// 更新已有的 SPU
export const reqAddOrUpdateSpu = (
  data //新增的 SPU | 已有的 SPU
) => {
  if (data.id) {
    request.post(API.UPDATESPU_URL, data);
  } else request.post(API.ADDSPU_URL, data);
};
