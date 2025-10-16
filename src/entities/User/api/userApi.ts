import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from 'shared/config/api.config';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}

export const userApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      credentials
    );
    return response.data;
  },

  logout: async (token: string): Promise<void> => {
    await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  getProfile: async (token: string) => {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.USER.PROFILE}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
