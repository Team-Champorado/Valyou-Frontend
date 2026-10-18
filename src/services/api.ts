import axios from 'axios';

// Defaults to your deployed Google Cloud Run backend API, or local dev if overridden
export const SERVER_ORIGIN = import.meta.env.VITE_SERVER_URL || 'https://valyou-server-816429071569.asia-southeast1.run.app';
export const API_URL = import.meta.env.VITE_API_URL || `${SERVER_ORIGIN}/api`;

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('valyou_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getFullImageUrl = (url?: string): string => {
  if (!url) {
    return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60';
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  return `${SERVER_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default api;
