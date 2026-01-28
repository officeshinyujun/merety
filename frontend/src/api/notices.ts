import apiClient from './client';
import { Notice } from '@/types/notice';
import { Pagination } from './admin-users';

export interface NoticeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateNoticeRequest {
  title: string;
  content_md: string;
}

export interface UpdateNoticeRequest {
  title?: string;
  content_md?: string;
}

export const noticesApi = {
  // GET /api/notices
  getNotices: async (params?: NoticeQueryParams): Promise<{ data: Notice[]; pagination: Pagination }> => {
    const response = await apiClient.get('/api/notices', { params });
    return response.data;
  },

  // GET /api/notices/:noticeId
  getNotice: async (noticeId: string): Promise<Notice> => {
    const response = await apiClient.get(`/api/notices/${noticeId}`);
    return response.data;
  },

  // POST /api/notices
  createNotice: async (data: CreateNoticeRequest): Promise<{ notice: Notice }> => {
    const response = await apiClient.post('/api/notices', data);
    return response.data;
  },

  // PATCH /api/notices/:noticeId
  updateNotice: async (noticeId: string, data: UpdateNoticeRequest): Promise<{ notice: Notice }> => {
    const response = await apiClient.patch(`/api/notices/${noticeId}`, data);
    return response.data;
  },

  // DELETE /api/notices/:noticeId
  deleteNotice: async (noticeId: string): Promise<void> => {
    await apiClient.delete(`/api/notices/${noticeId}`);
  },
};

export default noticesApi;
