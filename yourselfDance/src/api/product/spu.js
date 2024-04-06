import request from '@/utils/request';

const API = {
  // .获取当前页面数据
  HASSPU_URL: '/admin/product/',
  // .获取全部品牌的数据
  ALLTRADEMARK_URL: '/admin/product/baseTrademark/getTrademarkList',
  // .获取某个品牌的所有图片
  IMAGE_URL: '/admin/product/spuImageList/',
  // .获取某个品牌的销售属性列表
  SPUHASALEATTR_URL: '/admin/product/spuSaleAttrList/',
  // .获取全部销售属性
  ALLSALEATTR_URL: '/admin/product/baseSaleAttrList',
  // .添加一个新的 SPU
  ADDSPU_URL: '/admin/product/saveSpuInfo',
  // .更新已有的 SPU
  UPDATESPU_URL: '/admin/product/updateSpuInfo',
  // .追加一个新的SKU地址
  ADDSKU_URL: '/admin/product/saveSkuInfo',
  // .查看某一个SPU下的SKU
  SKUINFO_URL: '/admin/product/findBySpuId/',
  // .删除已有的SPU
  REMOVESPU_URL: '/admin/product/deleteSpu/',
};

// *获取对应分类的数据
export const reqHasSpu = (page, limit, category3Id) =>
  request.get(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`);

// *获取全部SPU品牌数据
export const reqAllTradeMark = () => request.get(API.ALLTRADEMARK_URL);

// *获取某个品牌的图片
export const reqSpuImageList = (spuId) => request.get(API.IMAGE_URL + spuId);

// *获取某个品牌的销售属性
export const reqSpuHasSaleAttr = (spuId) =>
  request.get(API.SPUHASALEATTR_URL + spuId);

// *获取全部销售属性
export const reqAllSaleAttr = () => request.get(API.ALLSALEATTR_URL);

// *添加一个新的SPU | 更新已有的SPU
export const reqAddOrUpdateSpu = (
  data // .新增的 SPU | 已有的 SPU
) => {
  if (data.id) {
    return request.post(API.UPDATESPU_URL, data);
  } else {
    return request.post(API.ADDSPU_URL, data);
  }
};

// *添加SKU的请求方法
export const reqAddSku = (data) => request.post(API.ADDSKU_URL, data);

// *获取SKU数据
export const reqSkuList = (spuId) => request.get(API.SKUINFO_URL + spuId);

// *删除已有的SPU
export const reqRemoveSpu = (spuId) =>
  request.delete(API.REMOVESPU_URL + spuId);
