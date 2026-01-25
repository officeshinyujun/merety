import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamMemberQueryDto } from './dto/team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/team')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  /**
   * GET /api/team/members
   * 팀 멤버 목록 조회
   */
  @Get('members')
  async findAllMembers(@Query() query: TeamMemberQueryDto) {
    return this.teamService.findAllMembers(query);
  }

  /**
   * GET /api/team/members/:memberId
   * 팀 멤버 상세 조회
   */
  @Get('members/:memberId')
  async findOneMember(@Param('memberId') memberId: string) {
    return this.teamService.findOneMember(memberId);
  }

  /**
   * GET /api/team/roles
   * 역할 정의 조회
   */
  @Get('roles')
  async getRoles() {
    return this.teamService.getRoles();
  }
}
