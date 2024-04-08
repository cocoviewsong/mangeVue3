import request from '@/utils/request';

const API = {
  // .获取全部职位接口
  ALLROLE_URL: '/admin/acl/role/',
  // .新增岗位的接口
  ADDROLE_URL: '/admin/acl/role/save',
  // .更新已有的职位
  UPDATEROLE_URL: '/admin/acl/role/update',
  // .获取菜单与按钮的全部数据
  ALLPERMISSTION_URL: '/admin/acl/permission/toAssign/',
  // .给用户分配权限
  SETPERMISSION_URL: '/admin/acl/permission/doAssign/?',
  // .删除已有的职位
  DELETEROLE_URL: '/admin/acl/role/remove/',
};

// *获取全部职位
export const reqAllRoleList = (page, limit, roleName) => {
  return request.get(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`
  );
};

// *新增或更新已有职位
export const reqAddOrUpdateRole = (data) => {
  if (data.id) {
    return request.put(API.UPDATEROLE_URL, data);
  } else {
    return request.post(API.ADDROLE_URL, data);
  }
};

// *获取菜单与按钮的全部数据
export const reqAllMenuList = (roleId) => {
  return request.get(API.ALLPERMISSTION_URL + roleId);
};

// *分配权限
export const reqSetPermission = (roleId, permissionId) => {
  return request.post(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`
  );
};

// *删除已有职位
export const reqDeleteRole = (roldId) => {
  return request.delete(API.DELETEROLE_URL + roldId);
};
