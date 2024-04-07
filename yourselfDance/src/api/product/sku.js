import request from '@/utils/request';

const API = {
  // .获取已有商品的数据
  SKU_URL: '/admin/product/list/',
  // .上架商品
  ADD_URL: '/admin/product/onSale/',
  // .下架已有商品
  CANCELSALE_URL: '/admin/product/cancelSale/',
  // .获取商品详情接口
  SKUINFO_URL: '/admin/product/getSkuInfo/',
  // .删除商品
  DELETESKU_URL: '/admin/product/deleteSku/',
};

// *获取商品SKU的接口
export const reqSkuList = (page, limit) =>
  request.get(API.SKU_URL + `${page}/${limit}`);

// *上架商品
export const reqSaleSku = (skuId) => request.get(API.ADD_URL + skuId);

// *下架商品
export const reqCancelSale = (skuId) => request.get(API.CANCELSALE_URL + skuId);

// *获取商品详情
export const reqSkuInfo = (skuId) => request.get(API.SKUINFO_URL + skuId);

// *删除商品
export const reqDeleteSku = (skuId) =>
  request.delete(API.DELETESKU_URL + skuId);
