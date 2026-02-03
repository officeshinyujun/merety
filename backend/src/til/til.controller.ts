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
import { TilService } from './til.service';
import { CreateTilDto, UpdateTilDto, TilQueryDto } from './dto/til.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class TilController {
  constructor(private readonly tilService: TilService) {}
  
  /**
   * GET /api/me/til
   * 내 개인 TIL 목록 조회
   */
  @Get('me/til')
  async findPersonal(@Query() query: TilQueryDto, @CurrentUser() user: User) {
    return this.tilService.findPersonal(user, query);
  }

  /**
   * POST /api/me/til
   * 내 개인 TIL 작성
   */
  @Post('me/til')
  async createPersonal(@Body() dto: CreateTilDto, @CurrentUser() user: User) {
    return this.tilService.create(dto, user);
  }

  /**
   * GET /api/studies/:studyId/til
   * TIL/WIL 목록 조회
   */
  @Get('studies/:studyId/til')
  async findByStudy(
    @Param('studyId') studyId: string,
    @Query() query: TilQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.tilService.findByStudy(studyId, query, user);
  }

  /**
   * GET /api/til/:postId
   * TIL/WIL 상세 조회
   */
  @Get('til/:postId')
  async findOne(@Param('postId') postId: string) {
    return this.tilService.findOne(postId);
  }

  /**
   * POST /api/studies/:studyId/til
   * TIL/WIL 작성 (스터디 참여자)
   */
  @Post('studies/:studyId/til')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('studyId') studyId: string,
    @Body() dto: CreateTilDto,
    @CurrentUser() user: User,
  ) {
    return this.tilService.create(dto, user, studyId);
  }

  /**
   * PATCH /api/til/:postId
   * TIL/WIL 수정 (작성자 본인 또는 SUPER_ADMIN)
   */
  @Patch('til/:postId')
  async update(
    @Param('postId') postId: string,
    @Body() dto: UpdateTilDto,
    @CurrentUser() user: User,
  ) {
    return this.tilService.update(postId, dto, user);
  }

  /**
   * DELETE /api/til/:postId
   * TIL/WIL 삭제 (작성자 본인 또는 SUPER_ADMIN)
   */
  @Delete('til/:postId')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('postId') postId: string,
    @CurrentUser() user: User,
  ) {
    return this.tilService.remove(postId, user);
  }
}
