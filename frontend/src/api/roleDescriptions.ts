
import apiClient from './client';
import { UserRole } from '@/types/user';

export interface RoleDescription {
    id: string;
    role: UserRole;
    description: string;
    updated_at: string;
}

const roleDescriptionsApi = {
    getRoleDescriptions: async () => {
        const response = await apiClient.get<RoleDescription[]>('/api/role-descriptions');
        return response.data;
    },

    updateRoleDescription: async (role: UserRole, description: string) => {
        const response = await apiClient.patch<RoleDescription>(`/api/role-descriptions/${role}`, { description });
        return response.data;
    },
};

export default roleDescriptionsApi;
