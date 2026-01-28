import apiClient from './client';
import { Study, StudyType, StudyStatus, StudyMemberRole } from '@/types/study';
import { User } from '@/types/user';
import { UUID } from '@/types/common';

export interface StudyQueryParams {
  status?: StudyStatus;
  type?: StudyType;
}

export interface CreateStudyRequest {
  name: string;
  type: StudyType;
  slug?: string;
  overview?: {
    description: string;
  };
  manager_ids?: UUID[];
}

export interface UpdateStudyRequest {
  name?: string;
  type?: StudyType;
  slug?: string;
  status?: StudyStatus;
}

export interface UpdateOverviewRequest {
  description: string;
}

export interface AddMemberRequest {
  user_id: UUID;
  member_role?: StudyMemberRole;
}

export interface UpdateMemberRoleRequest {
  member_role: StudyMemberRole;
}

export interface StudyMember {
  id: UUID;
  user: User;
  member_role: StudyMemberRole;
  joined_at: string;
}

export const studiesApi = {
  // GET /api/studies
  getStudies: async (params?: StudyQueryParams): Promise<{ data: Study[] }> => {
    const response = await apiClient.get('/api/studies', { params });
    return response.data;
  },

  // GET /api/studies/:studyId
  getStudy: async (studyId: string): Promise<Study> => {
    const response = await apiClient.get(`/api/studies/${studyId}`);
    return response.data;
  },

  // POST /api/studies
  createStudy: async (data: CreateStudyRequest): Promise<{ study: Study }> => {
    const response = await apiClient.post('/api/studies', data);
    return response.data;
  },

  // PATCH /api/studies/:studyId
  updateStudy: async (studyId: string, data: UpdateStudyRequest): Promise<{ study: Study }> => {
    const response = await apiClient.patch(`/api/studies/${studyId}`, data);
    return response.data;
  },

  // DELETE /api/studies/:studyId
  deleteStudy: async (studyId: string): Promise<void> => {
    await apiClient.delete(`/api/studies/${studyId}`);
  },

  // GET /api/studies/:studyId/overview
  getOverview: async (studyId: string): Promise<{ description: string }> => {
    const response = await apiClient.get(`/api/studies/${studyId}/overview`);
    return response.data;
  },

  // PATCH /api/studies/:studyId/overview
  updateOverview: async (studyId: string, data: UpdateOverviewRequest): Promise<void> => {
    await apiClient.patch(`/api/studies/${studyId}/overview`, data);
  },

  // GET /api/studies/:studyId/members
  getMembers: async (studyId: string): Promise<{ data: StudyMember[] }> => {
    const response = await apiClient.get(`/api/studies/${studyId}/members`);
    return response.data;
  },

  // POST /api/studies/:studyId/members
  addMember: async (studyId: string, data: AddMemberRequest): Promise<void> => {
    await apiClient.post(`/api/studies/${studyId}/members`, data);
  },

  // PATCH /api/studies/:studyId/members/:userId
  updateMemberRole: async (studyId: string, userId: string, data: UpdateMemberRoleRequest): Promise<void> => {
    await apiClient.patch(`/api/studies/${studyId}/members/${userId}`, data);
  },

  // DELETE /api/studies/:studyId/members/:userId
  removeMember: async (studyId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/api/studies/${studyId}/members/${userId}`);
  },
};

export default studiesApi;
