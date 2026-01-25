import { Controller, Get, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities';

@Controller('api/admin/metrics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  /**
   * GET /api/admin/metrics
   * 관리자 통계 (SUPER_ADMIN 전용)
   */
  @Get()
  async getMetrics() {
    return this.metricsService.getMetrics();
  }
}
