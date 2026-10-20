import { http } from './http';

export const toggleFavorite = (listingId) =>
  http.post('/api/favorite/toggle', { listingId });

export const getMyFavorites = () => http.get('/api/favorite/mine');

export const checkFavorite = (listingId) =>
  http.get(`/api/favorite/check/${listingId}`);
