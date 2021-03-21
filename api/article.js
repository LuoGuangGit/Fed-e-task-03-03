import { request } from '@/plugins/request';

// 获取文章列表
export const getArticles = params => request({
  method: 'GET',
  url: '/api/articles',
  params,
});

// 获取用户关注文章列表
export const getFeedArticles = params => request({
  method: 'GET',
  url: '/api/articles/feed',
  params,
});

// 点赞文章
export const addFavorite = slug => request({
  method: 'POST',
  url: `/api/articles/${slug}/favorite`,
});

// 取消点赞
export const deleteFavorite = slug => request({
  method: 'DELETE',
  url: `/api/articles/${slug}/favorite`,
});

// 获取文章详情
export const getArticle = slug => request({
  method: 'GET',
  url: `/api/articles/${slug}`,
});

// 获取文章评论
export const getComments = slug => request({
  method: 'GET',
  url: `/api/articles/${slug}/comments`,
});

// 添加文章评论
export const addComment = ({ slug, data }) => request({
  method: 'POST',
  url: `/api/articles/${slug}/comments`,
  data,
});

// 删除文章评论
export const deleteComment = ({ slug, id }) => request({
  method: 'DELETE',
  url: `/api/articles/${slug}/comments/${id}`,
});

// 添加文章
export const addArticle = (data) => request({
  method: 'POST',
  url: '/api/articles',
  data,
});

// 更新文章
export const updateArticle = ({ slug, data }) => request({
  method: 'PUT',
  url: `/api/articles/${slug}`,
  data,
});

// 删除文章
export const deleteArticle = (slug) => request({
  method: 'DELETE',
  url: `/api/articles/${slug}`,
});