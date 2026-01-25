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
import { NoticesService } from './notices.service';
import {
  CreateNoticeDto,
  UpdateNoticeDto,
  NoticeQueryDto,
} from './dto/notices.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../entities';

@Controller('api/notices')
@UseGuards(JwtAuthGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  /**
   * GET /api/notices
   * 공지사항 목록 조회
   */
  @Get()
  async findAll(@Query() query: NoticeQueryDto) {
    return this.noticesService.findAll(query);
  }

  /**
   * GET /api/notices/:noticeId
   * 공지사항 상세 조회
   */
  @Get(':noticeId')
  async findOne(@Param('noticeId') noticeId: string) {
    return this.noticesService.findOne(noticeId);
  }

  /**
   * POST /api/notices
   * 공지사항 작성 (SUPER_ADMIN 전용)
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateNoticeDto, @CurrentUser() user: User) {
    return this.noticesService.create(dto, user);
  }

  /**
   * PATCH /api/notices/:noticeId
   * 공지사항 수정 (SUPER_ADMIN 전용)
   */
  @Patch(':noticeId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async update(
    @Param('noticeId') noticeId: string,
    @Body() dto: UpdateNoticeDto,
  ) {
    return this.noticesService.update(noticeId, dto);
  }

  /**
   * DELETE /api/notices/:noticeId
   * 공지사항 삭제 (SUPER_ADMIN 전용)
   */
  @Delete(':noticeId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('noticeId') noticeId: string) {
    return this.noticesService.remove(noticeId);
  }
}
