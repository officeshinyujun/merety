import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArchiveService } from './archive.service';
import {
  UploadArchiveDto,
  CreateLinkDto,
  ArchiveQueryDto,
} from './dto/archive.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../entities';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  /**
   * GET /api/studies/:studyId/archive
   * 아카이브 목록 조회
   */
  @Get('studies/:studyId/archive')
  async findByStudy(
    @Param('studyId') studyId: string,
    @Query() query: ArchiveQueryDto,
  ) {
    return this.archiveService.findByStudy(studyId, query);
  }

  /**
   * POST /api/studies/:studyId/archive/upload
   * 파일 업로드 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  @Post('studies/:studyId/archive/upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @Param('studyId') studyId: string,
    @Body() dto: UploadArchiveDto,
    @UploadedFile() file: any,
    @CurrentUser() user: User,
  ) {
    return this.archiveService.uploadFile(studyId, dto, file, user);
  }

  /**
   * POST /api/studies/:studyId/archive/link
   * 링크 추가 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  @Post('studies/:studyId/archive/link')
  @HttpCode(HttpStatus.CREATED)
  async createLink(
    @Param('studyId') studyId: string,
    @Body() dto: CreateLinkDto,
    @CurrentUser() user: User,
  ) {
    return this.archiveService.createLink(studyId, dto, user);
  }

  /**
   * DELETE /api/archive/:archiveId
   * 아카이브 삭제 (SUPER_ADMIN 전용)
   */
  @Delete('archive/:archiveId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('archiveId') archiveId: string) {
    return this.archiveService.remove(archiveId);
  }

  /**
   * GET /api/archive/:archiveId/download
   * 파일 다운로드
   */
  @Get('archive/:archiveId/download')
  async download(@Param('archiveId') archiveId: string) {
    return this.archiveService.getDownloadInfo(archiveId);
  }
}
