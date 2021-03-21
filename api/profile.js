import { request } from '@/plugins/request';

// 获取 profile
export const getProfile = username => request({
  method: 'GET',
  url: `/api/profiles/${username}`,
});