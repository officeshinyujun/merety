import apiClient from './client';
import { User, UserRole, UserStatus } from '@/types/user';

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface CreateUserRequest {
  email: string;
  handle: string;
  name?: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
  status?: UserStatus;
  userImage?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export const adminUsersApi = {
  // GET /api/admin/users
  getUsers: async (params?: UserQueryParams): Promise<{ data: User[]; pagination: Pagination }> => {
    const response = await apiClient.get('/api/admin/users', { params });
    return response.data;
  },

  // POST /api/admin/users
  createUser: async (data: CreateUserRequest): Promise<{ user: User; temporary_password: string }> => {
    const response = await apiClient.post('/api/admin/users', data);
    return response.data;
  },

  // PATCH /api/admin/users/:userId
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<{ user: User }> => {
    const response = await apiClient.patch(`/api/admin/users/${userId}`, data);
    return response.data;
  },

  // POST /api/admin/users/:userId/reset-password
  resetPassword: async (userId: string): Promise<{ temporary_password: string; must_change_password: boolean }> => {
    const response = await apiClient.post(`/api/admin/users/${userId}/reset-password`);
    return response.data;
  },
};

export default adminUsersApi;
