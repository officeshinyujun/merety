import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import {
  CreateSessionDto,
  UpdateSessionDto,
  SessionQueryDto,
  BulkUpdateAttendanceDto,
} from './dto/sessions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../entities';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  // ==================== Sessions ====================

  /**
   * GET /api/studies/:studyId/sessions
   * 세션 목록 조회
   */
  @Get('studies/:studyId/sessions')
  async findByStudy(
    @Param('studyId') studyId: string,
    @Query() query: SessionQueryDto,
  ) {
    return this.sessionsService.findByStudy(studyId, query);
  }

  /**
   * GET /api/sessions/:sessionId
   * 세션 상세 조회
   */
  @Get('sessions/:sessionId')
  async findOne(@Param('sessionId') sessionId: string) {
    return this.sessionsService.findOne(sessionId);
  }

  /**
   * POST /api/studies/:studyId/sessions
   * 세션 생성 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  @Post('studies/:studyId/sessions')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('studyId') studyId: string,
    @Body() dto: CreateSessionDto,
    @CurrentUser() user: User,
  ) {
    return this.sessionsService.create(studyId, dto, user);
  }

  /**
   * PATCH /api/sessions/:sessionId
   * 세션 수정 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  @Patch('sessions/:sessionId')
  async update(
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateSessionDto,
    @CurrentUser() user: User,
  ) {
    return this.sessionsService.update(sessionId, dto, user);
  }

  /**
   * DELETE /api/sessions/:sessionId
   * 세션 삭제 (SUPER_ADMIN 전용)
   */
  @Delete('sessions/:sessionId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('sessionId') sessionId: string) {
    return this.sessionsService.remove(sessionId);
  }

  // ==================== Attendance ====================

  /**
   * GET /api/sessions/:sessionId/attendance
   * 출석 목록 조회
   */
  @Get('sessions/:sessionId/attendance')
  async getAttendance(@Param('sessionId') sessionId: string) {
    return this.sessionsService.getAttendance(sessionId);
  }

  /**
   * PUT /api/sessions/:sessionId/attendance
   * 출석 일괄 수정 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  @Put('sessions/:sessionId/attendance')
  async updateAttendance(
    @Param('sessionId') sessionId: string,
    @Body() dto: BulkUpdateAttendanceDto,
    @CurrentUser() user: User,
  ) {
    return this.sessionsService.updateAttendance(sessionId, dto, user);
  }
}
