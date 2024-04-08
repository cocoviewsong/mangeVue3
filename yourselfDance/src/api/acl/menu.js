import request from '@/utils/request';

const API = {
  // .获取菜单及所有按钮的接口
  GETMENU_URL: '/admin/acl/permission',
  // .新增菜单
  ADDMENU_URL: '/admin/acl/permission/save',
  // .更新菜单
  UPDATEMENU_URL: '/admin/acl/permission/update',
  // .删除菜单
  DELETEMENU_URL: '/admin/acl/permission/remove/',
};

// *获取菜单数据
export const reqAllPermission = () => {
  return request.get(API.GETMENU_URL);
};
// *添加与更新菜单的函数表达式
export const reqAddOrUpdateMenu = (data) => {
  if (data.id) {
    return request.put(API.UPDATEMENU_URL, data);
  } else {
    return request.post(API.ADDMENU_URL, data);
  }
};
// *删除菜单的函数表达式
export const reqDeleteMenu = (id) => {
  return request.delete(API.DELETEMENU_URL + id);
};
