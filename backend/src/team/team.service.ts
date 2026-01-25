import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { User, UserRole, UserStatus } from '../entities';
import { TeamMemberQueryDto } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 팀 멤버 목록 조회
   */
  async findAllMembers(query: TeamMemberQueryDto) {
    const { page = 1, limit = 10, search, role, status } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<User>[] = [];

    const baseCondition: FindOptionsWhere<User> = {
      status: status || UserStatus.ACTIVE,
    };
    if (role) baseCondition.role = role;

    if (search) {
      where.push(
        { ...baseCondition, name: Like(`%${search}%`) },
        { ...baseCondition, email: Like(`%${search}%`) },
        { ...baseCondition, handle: Like(`%${search}%`) },
      );
    } else {
      where.push(baseCondition);
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
      select: [
        'id',
        'email',
        'name',
        'handle',
        'user_image',
        'role',
        'status',
        'created_at',
      ],
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map((u) => ({
        user: {
          id: u.id,
          email: u.email,
          name: u.name,
          handle: u.handle,
          userImage: u.user_image,
          role: u.role,
          status: u.status,
        },
        joined_at: u.created_at,
        role: u.role,
      })),
      pagination: {
        total,
        page,
        limit,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    };
  }

  /**
   * 팀 멤버 상세 조회
   */
  async findOneMember(memberId: string) {
    const user = await this.userRepository.findOne({
      where: { id: memberId },
      select: [
        'id',
        'email',
        'name',
        'handle',
        'user_image',
        'role',
        'status',
        'created_at',
        'last_login_at',
      ],
    });

    if (!user) {
      throw new NotFoundException('멤버를 찾을 수 없습니다.');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        handle: user.handle,
        userImage: user.user_image,
        role: user.role,
        status: user.status,
        last_login_at: user.last_login_at,
      },
      joined_at: user.created_at,
      role: user.role,
    };
  }

  /**
   * 역할 정의 조회
   */
  async getRoles() {
    return {
      data: [
        {
          role: UserRole.SUPER_ADMIN,
          description: '전체 시스템 관리자. 모든 권한을 가집니다.',
        },
        {
          role: UserRole.STUDY_MANAGER,
          description: '스터디 담당자. 담당 스터디의 운영 권한을 가집니다.',
        },
        {
          role: UserRole.MEMBER,
          description: '일반 멤버. 스터디 참여 및 TIL 작성이 가능합니다.',
        },
      ],
    };
  }
}
