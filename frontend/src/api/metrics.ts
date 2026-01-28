import apiClient from './client';
import { UUID } from '@/types/common';

export interface StudyMetric {
  id: UUID;
  name: string;
  session_count: number;
  member_count: number;
  til_count: number;
}

export interface MonthlyTilStat {
  month: string; // YYYY-MM
  count: number;
}

export interface AttendanceStat {
  study_id: UUID;
  study_name: string;
  present_rate: number;
  late_rate: number;
  absent_rate: number;
}

export interface MetricsData {
  studies: StudyMetric[];
  monthly_til_stats: MonthlyTilStat[];
  attendance_stats: AttendanceStat[];
}

export const metricsApi = {
  // GET /api/admin/metrics
  getMetrics: async (): Promise<MetricsData> => {
    const response = await apiClient.get<MetricsData>('/api/admin/metrics');
    return response.data;
  },
};

export default metricsApi;
