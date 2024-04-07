import request from '@/utils/request';

const API = {
  // .获取全部职位接口
  ALLROLE_URL: '/admin/acl/role/',
  // .新增岗位的接口
  ADDROLE_URL: '/admin/acl/role/save',
  // .更新已有的职位
  UPDATEROLE_URL: '/admin/acl/role/update',
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
