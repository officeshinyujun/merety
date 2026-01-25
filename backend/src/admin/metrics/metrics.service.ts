import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Study,
  StudyMembership,
  Session,
  TilPost,
  Attendance,
  AttendanceStatus,
} from '../../entities';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Study)
    private studyRepository: Repository<Study>,
    @InjectRepository(StudyMembership)
    private membershipRepository: Repository<StudyMembership>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(TilPost)
    private tilRepository: Repository<TilPost>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  /**
   * 관리자 통계 (SUPER_ADMIN 전용)
   */
  async getMetrics() {
    // 스터디별 통계
    const studies = await this.studyRepository.find({
      where: { status: 'active' as any },
    });

    const studyStats = await Promise.all(
      studies.map(async (study) => {
        const sessionCount = await this.sessionRepository.count({
          where: { study_id: study.id },
        });

        const memberCount = await this.membershipRepository.count({
          where: { study_id: study.id },
        });

        const tilCount = await this.tilRepository.count({
          where: { study_id: study.id, is_deleted: false },
        });

        return {
          id: study.id,
          name: study.name,
          session_count: sessionCount,
          member_count: memberCount,
          til_count: tilCount,
        };
      }),
    );

    // 월별 TIL 통계 (최근 6개월)
    const monthlyTilStats = await this.getMonthlyTilStats();

    // 스터디별 출석 통계
    const attendanceStats = await Promise.all(
      studies.map(async (study) => {
        const sessions = await this.sessionRepository.find({
          where: { study_id: study.id },
          select: ['id'],
        });

        const sessionIds = sessions.map((s) => s.id);

        if (sessionIds.length === 0) {
          return {
            study_id: study.id,
            study_name: study.name,
            present_rate: 0,
            late_rate: 0,
            absent_rate: 0,
          };
        }

        const totalAttendance = await this.attendanceRepository
          .createQueryBuilder('attendance')
          .where('attendance.session_id IN (:...sessionIds)', { sessionIds })
          .getCount();

        if (totalAttendance === 0) {
          return {
            study_id: study.id,
            study_name: study.name,
            present_rate: 0,
            late_rate: 0,
            absent_rate: 0,
          };
        }

        const presentCount = await this.attendanceRepository
          .createQueryBuilder('attendance')
          .where('attendance.session_id IN (:...sessionIds)', { sessionIds })
          .andWhere('attendance.status = :status', {
            status: AttendanceStatus.PRESENT,
          })
          .getCount();

        const lateCount = await this.attendanceRepository
          .createQueryBuilder('attendance')
          .where('attendance.session_id IN (:...sessionIds)', { sessionIds })
          .andWhere('attendance.status = :status', {
            status: AttendanceStatus.LATE,
          })
          .getCount();

        const absentCount = await this.attendanceRepository
          .createQueryBuilder('attendance')
          .where('attendance.session_id IN (:...sessionIds)', { sessionIds })
          .andWhere('attendance.status = :status', {
            status: AttendanceStatus.ABSENT,
          })
          .getCount();

        return {
          study_id: study.id,
          study_name: study.name,
          present_rate: Math.round((presentCount / totalAttendance) * 100),
          late_rate: Math.round((lateCount / totalAttendance) * 100),
          absent_rate: Math.round((absentCount / totalAttendance) * 100),
        };
      }),
    );

    return {
      studies: studyStats,
      monthly_til_stats: monthlyTilStats,
      attendance_stats: attendanceStats,
    };
  }

  private async getMonthlyTilStats(): Promise<{ month: string; count: number }[]> {
    const stats: { month: string; count: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toISOString().slice(0, 7); // YYYY-MM

      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await this.tilRepository
        .createQueryBuilder('til')
        .where('til.is_deleted = false')
        .andWhere('til.created_at >= :start', { start: startOfMonth })
        .andWhere('til.created_at <= :end', { end: endOfMonth })
        .getCount();

      stats.push({ month, count });
    }

    return stats;
  }
}
