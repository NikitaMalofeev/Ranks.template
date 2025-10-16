import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from 'shared/config/api.config';
import { apiClient } from 'shared/api/axios.config';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId?: string;
}

export const userApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      credentials
    );

    // Handle different response structures from the API
    // API may return { token: "..." } or { data: { token: "..." } }
    const data = response.data;

    if (data.token) {
      return {
        token: data.token,
        userId: data.userId || data.user_id || 'admin',
      };
    } else if (data.data?.token) {
      return {
        token: data.data.token,
        userId: data.data.userId || data.data.user_id || 'admin',
      };
    }

    throw new Error('Invalid response format');
  },

  logout: async (token: string): Promise<void> => {
    await apiClient.post(
      API_ENDPOINTS.AUTH.LOGOUT,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  getProfile: async (token: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.USER.PROFILE,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
