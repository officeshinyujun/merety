import apiClient from './client';
import { Session } from '@/types/session';
import { Attendance, AttendanceStatus } from '@/types/attendance';
import { UUID } from '@/types/common';

export interface SessionQueryParams {
  status?: 'active' | 'archived';
}

export interface CreateSessionRequest {
  title: string;
  scheduled_at: string; // YYYY-MM-DD
  content_md?: string;
  data?: {
    materials?: string[];
  };
}

export interface UpdateSessionRequest {
  title?: string;
  scheduled_at?: string;
  content_md?: string;
  status?: 'active' | 'archived';
  data?: {
    materials?: string[];
  };
}

export interface AttendanceItem {
  user_id: UUID;
  status: AttendanceStatus;
  memo?: string;
}

export interface BulkUpdateAttendanceRequest {
  attendance: AttendanceItem[];
}

export const sessionsApi = {
  // GET /api/studies/:studyId/sessions
  getSessions: async (studyId: string, params?: SessionQueryParams): Promise<{ data: Session[] }> => {
    const response = await apiClient.get(`/api/studies/${studyId}/sessions`, { params });
    return response.data;
  },

  // GET /api/sessions/:sessionId
  getSession: async (sessionId: string): Promise<Session & { attendance: Attendance[] }> => {
    const response = await apiClient.get(`/api/sessions/${sessionId}`);
    return response.data;
  },

  // POST /api/studies/:studyId/sessions
  createSession: async (studyId: string, data: CreateSessionRequest): Promise<{ session: Session }> => {
    const response = await apiClient.post(`/api/studies/${studyId}/sessions`, data);
    return response.data;
  },

  // PATCH /api/sessions/:sessionId
  updateSession: async (sessionId: string, data: UpdateSessionRequest): Promise<{ session: Session }> => {
    const response = await apiClient.patch(`/api/sessions/${sessionId}`, data);
    return response.data;
  },

  // DELETE /api/sessions/:sessionId
  deleteSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/api/sessions/${sessionId}`);
  },

  // GET /api/sessions/:sessionId/attendance
  getAttendance: async (sessionId: string): Promise<{ data: Attendance[] }> => {
    const response = await apiClient.get(`/api/sessions/${sessionId}/attendance`);
    return response.data;
  },

  // PUT /api/sessions/:sessionId/attendance
  updateAttendance: async (sessionId: string, data: BulkUpdateAttendanceRequest): Promise<void> => {
    await apiClient.put(`/api/sessions/${sessionId}/attendance`, data);
  },
};

export default sessionsApi;
