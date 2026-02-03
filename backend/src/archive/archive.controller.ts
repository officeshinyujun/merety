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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArchiveService } from './archive.service';
import {
  UploadArchiveDto,
  UpdateArchiveDto,
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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/archives';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          const extension = extname(file.originalname);
          cb(null, `${randomName}${extension}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @Param('studyId') studyId: string,
    @Body() dto: UploadArchiveDto,
    @UploadedFile() file: Express.Multer.File,
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
   * PATCH /api/archive/:archiveId
   * 아카이브 수정 (업로더 또는 매니저)
   */
  @Patch('archive/:archiveId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('archiveId') archiveId: string,
    @Body() dto: UpdateArchiveDto,
    @CurrentUser() user: User,
  ) {
    return this.archiveService.update(archiveId, dto, user);
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
