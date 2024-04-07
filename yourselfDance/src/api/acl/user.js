import request from '@/utils/request';

// # http://139.198.104.58:8212/swagger-ui.html#!/admin45controller/indexUsingGET

const API = {
  // .获取全部用户信息  (用户密码也在这里)
  ALLUSER_URL: '/admin/acl/user/',
  // .添加用户
  ADDUSER_URL: '/admin/acl/user/save',
  // .修改用户
  UPDATEUSER_URL: '/admin/acl/user/update',
  // .获取全部职位,以及当前账号拥有职位的接口
  ALLROLE_URL: '/admin/acl/user/toAssign/',
  // .给已有的用户分配职位接口
  SETROLE_URL: '/admin/acl/user/doAssignRole',
  // .删除某个账号
  DELETEUSER_URL: '/admin/acl/user/remove/',
  // .批量删除
  ALLDELETEUSERS_URL: '/admin/acl/user/batchRemove',
};

// *获取用户信息
export const reqUserInfo = (page, limit, username) =>
  request.get(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`);

// *添加用户与更新已有用户
export const reqAddOrUpdateUser = (data) => {
  // .携带的参数有ID -> 修改
  if (data.id) {
    return request.put(API.UPDATEUSER_URL, data);
  }
  // .无 -> 添加
  else {
    return request.post(API.ADDUSER_URL, data);
  }
};

// *获取全部职位以及包含当前用户已有职位的数据
export const reqAllRole = (userId) => {
  return request.get(API.ALLROLE_URL + userId);
};

// *分配职位
export const reqSetUserRole = (data) => {
  return request.post(API.SETROLE_URL, data);
};

// *删除某个账号的信息
export const reqRemoveUser = (userId) => {
  return request.delete(API.DELETEUSER_URL + userId);
};

// *批量删除账号信息
export const reqSelectUser = (idList) => {
  return request.delete(API.ALLDELETEUSERS_URL, { data: idList });
};
