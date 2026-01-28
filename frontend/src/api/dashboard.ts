import apiClient from './client';
import { StudyType } from '@/types/study';
import { UUID } from '@/types/common';

export interface MyStudy {
  id: UUID;
  name: string;
  type: StudyType;
  is_manager: boolean;
  member_count: number;
}

export interface TilStats {
  total_count: number;
  monthly_count: number;
}

export interface CalendarEvent {
  id: UUID;
  title: string;
  date: string;
  type: 'session' | 'deadline' | 'event';
}

export interface ActivityLog {
  id: UUID;
  user_id: UUID;
  action_type: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity_type: 'USER' | 'STUDY' | 'SESSION' | 'TIL_POST' | 'ARCHIVE' | 'NOTICE' | 'ATTENDANCE';
  entity_id: UUID;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface DashboardData {
  my_studies: MyStudy[];
  til_stats: TilStats;
  recent_activities: ActivityLog[];
  calendar_events: CalendarEvent[];
}

export const dashboardApi = {
  // GET /api/dashboard
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>('/api/dashboard');
    return response.data;
  },
};

export default dashboardApi;
