import { http } from './http';

export const updateUser = (userId, formData) =>
  http.post(`/api/user/update/${userId}`, formData);

export const deleteUser = (userId) =>
  http.delete(`/api/user/delete/${userId}`);

export const getUserListings = (userId) =>
  http.get(`/api/user/listings/${userId}`);

export const getUser = (userId) => http.get(`/api/user/${userId}`);
