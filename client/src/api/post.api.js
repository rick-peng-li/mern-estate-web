import { http } from './http';

export const getPosts = (limit) =>
  http.get(`/api/post/all${limit ? `?limit=${limit}` : ''}`);

export const getPost = (postId) => http.get(`/api/post/${postId}`);

export const createPost = (formData) => http.post('/api/post/create', formData);

export const deletePost = (postId) => http.delete(`/api/post/${postId}`);
