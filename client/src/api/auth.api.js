import { http } from './http';

export const signUp = (formData) => http.post('/api/auth/signup', formData);

export const signIn = (formData) => http.post('/api/auth/signin', formData);

export const googleSignIn = (payload) => http.post('/api/auth/google', payload);

export const signOut = () => http.get('/api/auth/signout');
