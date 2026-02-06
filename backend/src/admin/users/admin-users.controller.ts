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
import { AdminUsersService } from './admin-users.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto/admin-users.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities';

@Controller('api/admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) { }

  /**
   * GET /api/admin/users
   * 유저 목록 조회
   */
  @Get()
  async findAll(@Query() query: UserQueryDto) {
    return this.adminUsersService.findAll(query);
  }

  /**
   * POST /api/admin/users
   * 유저 생성
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    return this.adminUsersService.create(dto);
  }

  /**
   * PATCH /api/admin/users/:userId
   * 유저 정보 수정
   */
  @Patch(':userId')
  async update(@Param('userId') userId: string, @Body() dto: UpdateUserDto) {
    return this.adminUsersService.update(userId, dto);
  }

  /**
   * POST /api/admin/users/:userId/reset-password
   * 비밀번호 초기화
   */
  @Post(':userId/reset-password')
  async resetPassword(@Param('userId') userId: string) {
    return this.adminUsersService.resetPassword(userId);
  }

  /**
   * DELETE /api/admin/users/:userId
   * 유저 삭제
   */
  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('userId') userId: string) {
    return this.adminUsersService.remove(userId);
  }
}
