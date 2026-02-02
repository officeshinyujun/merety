import apiClient from './client';
import { User } from '@/types/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  must_change_password: boolean;
}

export interface ChangePasswordRequest {
  current_password?: string;
  new_password: string;
  confirm_password: string;
}

export const authApi = {
  // POST /api/auth/login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
    // 토큰 저장
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    return response.data;
  },

  // POST /api/auth/logout
  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // POST /api/auth/refresh
  refresh: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await apiClient.post('/api/auth/refresh', { refresh_token: refreshToken });
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  // GET /api/auth/me
  getMe: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<{ user: User }>('/api/auth/me');
    return response.data;
  },

  // POST /api/auth/change-password
  changePassword: async (data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/api/auth/change-password', data);
    return response.data;
  },

  // POST /api/upload/profile
  uploadProfile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default authApi;
