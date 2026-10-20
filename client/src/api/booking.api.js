import { http } from './http';

export const createBooking = (payload) =>
  http.post('/api/booking/create', payload);

export const getMyBookings = () => http.get('/api/booking/mine');

export const getReceivedBookings = () => http.get('/api/booking/received');

export const updateBookingStatus = (bookingId, status) =>
  http.post(`/api/booking/status/${bookingId}`, { status });

export const cancelBooking = (bookingId) =>
  http.post(`/api/booking/cancel/${bookingId}`);
