import apiClient from './client';
import { User, UserRole, UserStatus } from '@/types/user';
import { Pagination } from './admin-users';

export interface TeamMemberQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface TeamMember {
  user: User;
  joined_at: string;
  role: UserRole;
}

export interface RoleDefinition {
  role: UserRole;
  description: string;
}

export const teamApi = {
  // GET /api/team/members
  getMembers: async (params?: TeamMemberQueryParams): Promise<{ data: TeamMember[]; pagination: Pagination }> => {
    const response = await apiClient.get('/api/team/members', { params });
    return response.data;
  },

  // GET /api/team/members/:memberId
  getMember: async (memberId: string): Promise<TeamMember> => {
    const response = await apiClient.get(`/api/team/members/${memberId}`);
    return response.data;
  },

  // GET /api/team/roles
  getRoles: async (): Promise<{ data: RoleDefinition[] }> => {
    const response = await apiClient.get('/api/team/roles');
    return response.data;
  },
};

export default teamApi;
