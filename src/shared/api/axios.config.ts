import axios from 'axios';
import { API_BASE_URL } from 'shared/config/api.config';
import { store } from 'app/providers/store/config/store';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.token;

    if (token) {
      config.headers.Authorization = `token ${token}`;
      console.log('[API Request] URL:', config.url);
      console.log('[API Request] Token (first 20 chars):', token.substring(0, 20) + '...');
      console.log('[API Request] Authorization header:', config.headers.Authorization);
    } else {
      console.warn('[API Request] No token found in Redux state!');
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Response] Success:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('[API Response] 401 Unauthorized!');
      console.error('[API Response] URL:', error.config?.url);
      console.error('[API Response] Token used:', error.config?.headers?.Authorization);
      console.error('[API Response] Error details:', error.response?.data);
    } else {
      console.error('[API Response] Error:', error.response?.status, error.message);
    }

    return Promise.reject(error);
  }
);
