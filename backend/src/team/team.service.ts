import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Between } from 'typeorm';
import { User, UserRole, UserStatus, TilPost, Archive, Attendance, AttendanceStatus, Session } from '../entities';
import { TeamMemberQueryDto } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TilPost)
    private tilRepository: Repository<TilPost>,
    @InjectRepository(Archive)
    private archiveRepository: Repository<Archive>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
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
          user_image: u.user_image,
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
    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(memberId)) {
      throw new NotFoundException('유효하지 않은 멤버 ID 형식입니다.');
    }

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
        user_image: user.user_image,
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

  /**
   * 팀 멤버 활동 통계 (TIL, WIL, 출석, 잔디)
   */
  async getMemberContributions(memberId: string) {
    const now = new Date();
    const contributions: any[] = [];

    // 과거 12개월 통계
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59);

      // TIL 개수
      const tilCount = await this.tilRepository.count({
        where: {
          author_id: memberId,
          is_deleted: false,
          created_at: Between(startOfMonth, endOfMonth),
        },
      });

      // WIL 개수
      const wilCount = await this.archiveRepository.count({
        where: {
          uploader_id: memberId,
          is_deleted: false,
          created_at: Between(startOfMonth, endOfMonth),
        },
      });

      // 출석률 계산 (해당 월의 스터디 세션 기준)
      const attendances = await this.attendanceRepository.find({
        where: {
          user_id: memberId,
        },
        relations: ['session'],
      });

      const monthlyAttendances = attendances.filter((a) => {
        const sessionDate = new Date(a.session.scheduled_at);
        return sessionDate >= startOfMonth && sessionDate <= endOfMonth;
      });

      const presentCount = monthlyAttendances.filter(
        (a) => a.status === AttendanceStatus.PRESENT,
      ).length;
      const participationRate =
        monthlyAttendances.length > 0
          ? Math.round((presentCount / monthlyAttendances.length) * 1000) / 10
          : 0;

      // 최근 활동 (TOP 3)
      const recentTils = await this.tilRepository.find({
        where: {
          author_id: memberId,
          is_deleted: false,
          created_at: Between(startOfMonth, endOfMonth),
        },
        order: { created_at: 'DESC' },
        take: 3,
      });

      const recentWils = await this.archiveRepository.find({
        where: {
          uploader_id: memberId,
          is_deleted: false,
          created_at: Between(startOfMonth, endOfMonth),
        },
        order: { created_at: 'DESC' },
        take: 3,
      });

      const recent = [
        ...recentTils.map((t) => ({
          title: t.title,
          category: 'TIL',
          time: t.created_at.toISOString().split('T')[0],
        })),
        ...recentWils.map((w) => ({
          title: w.title,
          category: 'WIL',
          time: w.created_at.toISOString().split('T')[0],
        })),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 3);

      // 잔디 (일별 활동 강도)
      const grass: any[] = [];
      const daysInMonth = endOfMonth.getDate();
      for (let day = 1; day <= 32; day++) {
        if (day > daysInMonth) {
          grass.push({ day: day.toString(), measure: 0 });
          continue;
        }

        const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

        const dailyTil = await this.tilRepository.count({
          where: {
            author_id: memberId,
            is_deleted: false,
            created_at: Between(startOfDay, endOfDay),
          },
        });
        const dailyWil = await this.archiveRepository.count({
          where: {
            uploader_id: memberId,
            is_deleted: false,
            created_at: Between(startOfDay, endOfDay),
          },
        });

        grass.push({ day: day.toString(), measure: dailyTil + dailyWil });
      }

      contributions.push({
        month,
        year,
        tilCount,
        wilCount,
        participationRate,
        recent,
        grass,
      });
    }

    return contributions.reverse();
  }
}
