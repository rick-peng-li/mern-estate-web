import { http } from './http';

export const createListing = (formData) =>
  http.post('/api/listing/create', formData);

export const updateListing = (listingId, formData) =>
  http.post(`/api/listing/update/${listingId}`, formData);

export const deleteListing = (listingId) =>
  http.delete(`/api/listing/delete/${listingId}`);

export const getListing = (listingId) =>
  http.get(`/api/listing/get/${listingId}`);

export const getListings = (params) =>
  http.get(`/api/listing/get?${new URLSearchParams(params)}`);
