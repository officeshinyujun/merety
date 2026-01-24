import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../entities';

export const ROLES_KEY = 'roles';

/**
 * 엔드포인트에 필요한 역할을 지정하는 데코레이터
 * @example
 * @Roles(UserRole.SUPER_ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
