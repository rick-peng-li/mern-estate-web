import { http } from './http';

export const createReview = (payload) =>
  http.post('/api/review/create', payload);

export const getListingReviews = (listingId) =>
  http.get(`/api/review/listing/${listingId}`);

export const deleteReview = (reviewId) =>
  http.delete(`/api/review/${reviewId}`);
