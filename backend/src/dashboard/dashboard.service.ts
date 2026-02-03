import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull } from 'typeorm';
import {
  Study,
  StudyMembership,
  Session,
  TilPost,
  ActivityLog,
  User,
} from '../entities';
import { StudyMemberRole } from '../entities/study-membership.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Study)
    private studyRepository: Repository<Study>,
    @InjectRepository(StudyMembership)
    private membershipRepository: Repository<StudyMembership>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(TilPost)
    private tilRepository: Repository<TilPost>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  /**
   * 메인 대시보드 데이터
   */
  async getDashboard(user: User) {
    // 내 스터디 목록
    const myMemberships = await this.membershipRepository.find({
      where: { user_id: user.id },
      relations: ['study', 'study.memberships', 'study.memberships.user'],
    });

    const myStudies = myMemberships.map((m) => ({
      id: m.study.id,
      name: m.study.name,
      type: m.study.type,
      is_manager: m.member_role === StudyMemberRole.MANAGER,
      member_count: m.study.memberships?.length || 0,
      member_images: m.study.memberships?.slice(0, 4).map(ms => ms.user?.user_image).filter(img => !!img) || [],
    }));

    // TIL 통계 (개인 TIL만)
    const totalTilCount = await this.tilRepository.count({
      where: { 
        author_id: user.id, 
        is_deleted: false,
        category: 'TIL' as any,
        study_id: IsNull()
      },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthlyTilCount = await this.tilRepository.count({
      where: {
        author_id: user.id,
        is_deleted: false,
        category: 'TIL' as any,
        study_id: IsNull(),
        created_at: Between(startOfMonth, endOfMonth),
      },
    });

    // 최근 작성한 개인 TIL 3개
    const recentTils = await this.tilRepository.find({
      where: {
        author_id: user.id,
        is_deleted: false,
        category: 'TIL' as any,
        study_id: IsNull(),
      },
      order: { created_at: 'DESC' },
      take: 3,
    });

    // 최근 활동 로그
    const recentActivities = await this.activityLogRepository.find({
      where: { user_id: user.id },
      order: { created_at: 'DESC' },
      take: 10,
    });

    // 캘린더 이벤트 (향후 세션)
    const upcomingSessions = await this.sessionRepository
      .createQueryBuilder('session')
      .innerJoin('session.study', 'study')
      .innerJoin(
        StudyMembership,
        'membership',
        'membership.study_id = study.id AND membership.user_id = :userId',
        { userId: user.id },
      )
      .where('session.scheduled_at >= :today', {
        today: new Date().toISOString().split('T')[0],
      })
      .andWhere('session.status = :status', { status: 'active' })
      .orderBy('session.scheduled_at', 'ASC')
      .take(10)
      .getMany();

    const calendarEvents = upcomingSessions.map((s) => ({
      id: s.id,
      title: s.title,
      date: s.scheduled_at ? new Date(s.scheduled_at).toISOString().split('T')[0] : '',
      type: 'session' as const,
    }));

    return {
      my_studies: myStudies,
      til_stats: {
        total_count: totalTilCount,
        monthly_count: monthlyTilCount,
      },
      recent_tils: recentTils.map(t => ({
        id: t.id,
        title: t.title,
        created_at: t.created_at
      })),
      recent_activities: recentActivities,
      calendar_events: calendarEvents,
    };
  }
}
