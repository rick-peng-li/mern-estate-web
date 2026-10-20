import { http } from './http';

export const getMyNotifications = () => http.get('/api/notification/mine');

export const markAllRead = () => http.post('/api/notification/read-all');
