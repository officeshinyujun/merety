import apiClient from './client';
import { TilPost } from '@/types/til';
import { UUID } from '@/types/common';
import { Pagination } from './admin-users';

export interface TilQueryParams {
  page?: number;
  limit?: number;
  author_id?: UUID;
  tag?: string;
  mine?: boolean;
  search?: string;
  category?: 'TIL' | 'WIL';
}

export interface CreateTilRequest {
  title: string;
  content_md: string;
  tags?: string[];
  category?: 'TIL' | 'WIL';
}

export interface UpdateTilRequest {
  title?: string;
  content_md?: string;
  tags?: string[];
  category?: 'TIL' | 'WIL';
}

export interface TilStats {
  total_count: number;
  monthly_count: number;
}

export const tilApi = {
  // GET /api/til (Global list)
  getGlobalTilPosts: async (params?: TilQueryParams): Promise<{ data: TilPost[]; pagination: Pagination }> => {
    const response = await apiClient.get('/api/til', { params });
    return response.data;
  },

  // GET /api/til/stats
  getMyTilStats: async (): Promise<TilStats> => {
    const response = await apiClient.get('/api/til/stats');
    return response.data;
  },

  // GET /api/studies/:studyId/til
  getTilPosts: async (studyId: string, params?: TilQueryParams): Promise<{ data: TilPost[]; pagination: Pagination }> => {
    const response = await apiClient.get(`/api/studies/${studyId}/til`, { params });
    return response.data;
  },

  // GET /api/til/:postId
  getTilPost: async (postId: string): Promise<TilPost> => {
    const response = await apiClient.get(`/api/til/${postId}`);
    return response.data;
  },

  // POST /api/me/til (Personal TIL)
  createPersonalTilPost: async (data: CreateTilRequest): Promise<{ post: TilPost }> => {
    const response = await apiClient.post('/api/me/til', data);
    return response.data;
  },

  // POST /api/studies/:studyId/til
  createTilPost: async (studyId: string, data: CreateTilRequest): Promise<{ post: TilPost }> => {
    const response = await apiClient.post(`/api/studies/${studyId}/til`, data);
    return response.data;
  },

  // PATCH /api/til/:postId
  updateTilPost: async (postId: string, data: UpdateTilRequest): Promise<{ post: TilPost }> => {
    const response = await apiClient.patch(`/api/til/${postId}`, data);
    return response.data;
  },

  // DELETE /api/til/:postId
  deleteTilPost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/api/til/${postId}`);
  },
};

export default tilApi;
