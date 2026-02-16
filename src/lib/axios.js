import { useAuthStore } from '@/store/auth.store';
import axios from 'axios';

const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL_LIVE
  : import.meta.env.VITE_API_URL_DEV;

const $api = axios.create({
  baseURL,
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

$api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error?.response)
);

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error?.response);
  }
);

export default $api;
