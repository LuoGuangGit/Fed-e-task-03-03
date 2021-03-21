import { request } from '@/plugins/request';

// 用户登录
export const login = data => request({
  method: 'POST',
  url: '/api/users/login',
  data,
});

// 用户注册
export const register = data => request({
  method: 'POST',
  url: '/api/users',
  data,
});

// 关注用户
export const addFollow = username => request({
  method: 'POST',
  url: `/api/profiles/${username}/follow`,
});

// 取消关注
export const deleteFollow = username => request({
  method: 'DELETE',
  url: `/api/profiles/${username}/follow`,
});

// 修改用户数据
export const updateUser = data => request({
  method: 'PUT',
  url: '/api/user',
  data,
});

// 获取用户数据
export const getUser = () => request({
  method: 'GET',
  url: '/api/user',
});