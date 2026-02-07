import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { RoleDescriptionsService } from './role-descriptions.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/role-descriptions')
@UseGuards(JwtAuthGuard)
export class RoleDescriptionsController {
    constructor(private readonly roleDescriptionsService: RoleDescriptionsService) { }

    @Get()
    findAll() {
        return this.roleDescriptionsService.findAll();
    }

    @Patch(':role')
    @UseGuards(RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    update(@Param('role') role: UserRole, @Body('description') description: string) {
        return this.roleDescriptionsService.update(role, description);
    }
}
