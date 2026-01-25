import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StudiesService } from './studies.service';
import {
  CreateStudyDto,
  UpdateStudyDto,
  StudyQueryDto,
  UpdateOverviewDto,
  AddMemberDto,
  UpdateMemberRoleDto,
} from './dto/studies.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../entities';

@Controller('api/studies')
@UseGuards(JwtAuthGuard)
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  // ==================== Studies CRUD ====================

  /**
   * GET /api/studies
   * 스터디 목록 조회
   */
  @Get()
  async findAll(@Query() query: StudyQueryDto) {
    return this.studiesService.findAll(query);
  }

  /**
   * GET /api/studies/:studyId
   * 스터디 상세 조회
   */
  @Get(':studyId')
  async findOne(@Param('studyId') studyId: string) {
    return this.studiesService.findOne(studyId);
  }

  /**
   * POST /api/studies
   * 스터디 생성 (SUPER_ADMIN 전용)
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateStudyDto, @CurrentUser() user: User) {
    return this.studiesService.create(dto, user.id);
  }

  /**
   * PATCH /api/studies/:studyId
   * 스터디 수정 (SUPER_ADMIN 전용)
   */
  @Patch(':studyId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async update(
    @Param('studyId') studyId: string,
    @Body() dto: UpdateStudyDto,
  ) {
    return this.studiesService.update(studyId, dto);
  }

  /**
   * DELETE /api/studies/:studyId
   * 스터디 삭제 (SUPER_ADMIN 전용)
   */
  @Delete(':studyId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('studyId') studyId: string) {
    return this.studiesService.remove(studyId);
  }

  // ==================== Overview ====================

  /**
   * GET /api/studies/:studyId/overview
   * Overview 조회
   */
  @Get(':studyId/overview')
  async getOverview(@Param('studyId') studyId: string) {
    return this.studiesService.getOverview(studyId);
  }

  /**
   * PATCH /api/studies/:studyId/overview
   * Overview 수정 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  @Patch(':studyId/overview')
  async updateOverview(
    @Param('studyId') studyId: string,
    @Body() dto: UpdateOverviewDto,
    @CurrentUser() user: User,
  ) {
    return this.studiesService.updateOverview(studyId, dto, user);
  }

  // ==================== Members ====================

  /**
   * GET /api/studies/:studyId/members
   * 멤버 목록 조회
   */
  @Get(':studyId/members')
  async getMembers(@Param('studyId') studyId: string) {
    return this.studiesService.getMembers(studyId);
  }

  /**
   * POST /api/studies/:studyId/members
   * 멤버 추가 (SUPER_ADMIN 전용)
   */
  @Post(':studyId/members')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async addMember(
    @Param('studyId') studyId: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.studiesService.addMember(studyId, dto);
  }

  /**
   * PATCH /api/studies/:studyId/members/:userId
   * 멤버 역할 변경 (SUPER_ADMIN 전용)
   */
  @Patch(':studyId/members/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async updateMemberRole(
    @Param('studyId') studyId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.studiesService.updateMemberRole(studyId, userId, dto);
  }

  /**
   * DELETE /api/studies/:studyId/members/:userId
   * 멤버 제거 (SUPER_ADMIN 전용)
   */
  @Delete(':studyId/members/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @Param('studyId') studyId: string,
    @Param('userId') userId: string,
  ) {
    return this.studiesService.removeMember(studyId, userId);
  }
}
