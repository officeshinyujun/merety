import apiClient from './client';
import { Archive, ArchiveType, ArchiveCategory } from '@/types/archive';

export interface ArchiveQueryParams {
  category?: ArchiveCategory;
  type?: ArchiveType;
}

export interface UploadArchiveRequest {
  file: File;
  title: string;
  category: ArchiveCategory;
}

export interface CreateLinkRequest {
  title: string;
  url: string;
}

export const archiveApi = {
  // GET /api/studies/:studyId/archive
  getArchives: async (studyId: string, params?: ArchiveQueryParams): Promise<{ data: Archive[] }> => {
    const response = await apiClient.get(`/api/studies/${studyId}/archive`, { params });
    return response.data;
  },

  // POST /api/studies/:studyId/archive/upload
  uploadFile: async (studyId: string, data: UploadArchiveRequest): Promise<{ archive: Archive }> => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('category', data.category);

    const response = await apiClient.post(`/api/studies/${studyId}/archive/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // POST /api/studies/:studyId/archive/link
  createLink: async (studyId: string, data: CreateLinkRequest): Promise<{ archive: Archive }> => {
    const response = await apiClient.post(`/api/studies/${studyId}/archive/link`, data);
    return response.data;
  },

  // DELETE /api/archive/:archiveId
  deleteArchive: async (archiveId: string): Promise<void> => {
    await apiClient.delete(`/api/archive/${archiveId}`);
  },

  // GET /api/archive/:archiveId/download
  getDownloadUrl: async (archiveId: string): Promise<{ url: string }> => {
    const response = await apiClient.get(`/api/archive/${archiveId}/download`);
    return response.data;
  },
};

export default archiveApi;
