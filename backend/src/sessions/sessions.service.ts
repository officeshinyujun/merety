import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Session,
  SessionStatus,
  Attendance,
  AttendanceStatus,
  Study,
  User,
  UserRole,
  StudyMembership,
  Archive,
} from '../entities';
import { StudyMemberRole } from '../entities/study-membership.entity';
import {
  CreateSessionDto,
  UpdateSessionDto,
  SessionQueryDto,
  BulkUpdateAttendanceDto,
} from './dto/sessions.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Study)
    private studyRepository: Repository<Study>,
    @InjectRepository(StudyMembership)
    private membershipRepository: Repository<StudyMembership>,
    @InjectRepository(Archive)
    private archiveRepository: Repository<Archive>,
  ) {}

  // ==================== Sessions CRUD ====================

  /**
   * 세션 목록 조회
   */
  async findByStudy(studyId: string, query: SessionQueryDto) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    const queryBuilder = this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.creator', 'creator')
      .where('session.study_id = :studyId', { studyId });

    if (query.status) {
      queryBuilder.andWhere('session.status = :status', {
        status: query.status,
      });
    }

    queryBuilder.orderBy('session.session_no', 'DESC');

    const sessions = await queryBuilder.getMany();

    return {
      data: sessions.map((s) => ({
        ...s,
        createUser: s.creator
          ? {
              name: s.creator.name,
              userImage: s.creator.user_image,
            }
          : null,
      })),
    };
  }

  /**
   * 세션 상세 조회
   */
  async findOne(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['creator', 'attendances', 'attendances.user', 'archives'],
    });

    if (!session) {
      throw new NotFoundException('세션을 찾을 수 없습니다.');
    }

    // Fetch all study members
    const members = await this.membershipRepository.find({
      where: { study_id: session.study_id },
      relations: ['user'],
    });

    const attendanceMap = new Map(
      session.attendances.map((a) => [a.user_id, a]),
    );

    const fullAttendance = members.map((m) => {
      const att = attendanceMap.get(m.user_id);
      if (att) {
        return {
          id: att.id,
          session_id: att.session_id,
          user_id: att.user_id,
          status: att.status,
          memo: att.memo,
          updated_by: att.updated_by,
          updated_at: att.updated_at,
          user: {
            id: att.user.id,
            name: att.user.name,
            handle: att.user.handle,
            user_image: att.user.user_image,
          },
        };
      } else {
        // Virtual attendance for member without record
        return {
          id: `virtual-${m.user_id}`,
          session_id: session.id,
          user_id: m.user_id,
          status: AttendanceStatus.UNKNOWN,
          memo: '',
          updated_by: null,
          updated_at: null,
          user: {
            id: m.user.id,
            name: m.user.name,
            handle: m.user.handle,
            user_image: m.user.user_image,
          },
        };
      }
    });

    return {
      ...session,
      createUser: session.creator
        ? {
            name: session.creator.name,
            userImage: session.creator.user_image,
          }
        : null,
      attendance: fullAttendance,
    };
  }

  /**
   * 세션 생성 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  async create(studyId: string, dto: CreateSessionDto, user: User) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    // 권한 체크
    await this.checkStudyManagerPermission(studyId, user);

    // 다음 session_no 계산
    const lastSession = await this.sessionRepository.findOne({
      where: { study_id: studyId },
      order: { session_no: 'DESC' },
    });
    const nextSessionNo = lastSession ? lastSession.session_no + 1 : 1;

    const session = this.sessionRepository.create({
      study_id: studyId,
      session_no: nextSessionNo,
      round: dto.round || 1,
      title: dto.title,
      scheduled_at: dto.scheduled_at ? new Date(dto.scheduled_at) : undefined,
      content_md: dto.content_md || '',
      data: dto.data || {},
      status: SessionStatus.ACTIVE,
      created_by: user.id,
    });

    const savedSession = await this.sessionRepository.save(session);

    if (dto.archiveIds && dto.archiveIds.length > 0) {
      await this.archiveRepository
        .createQueryBuilder()
        .update(Archive)
        .set({ session_id: savedSession.id })
        .where('id IN (:...ids)', { ids: dto.archiveIds })
        .execute();
    }

    // Initialize attendance for all study members
    const memberships = await this.membershipRepository.find({
      where: { study_id: studyId },
    });

    if (memberships.length > 0) {
      const attendanceEntities = memberships.map((m) =>
        this.attendanceRepository.create({
          session_id: savedSession.id,
          user_id: m.user_id,
          status: AttendanceStatus.UNKNOWN,
          memo: '',
          updated_by: user.id,
        }),
      );
      await this.attendanceRepository.save(attendanceEntities);
    }

    return savedSession;
  }

  /**
   * 세션 수정 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  async update(sessionId: string, dto: UpdateSessionDto, user: User) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('세션을 찾을 수 없습니다.');
    }

    // 권한 체크
    await this.checkStudyManagerPermission(session.study_id, user);

    if (dto.title !== undefined) session.title = dto.title;
    if (dto.scheduled_at !== undefined)
      session.scheduled_at = new Date(dto.scheduled_at);
    if (dto.content_md !== undefined) session.content_md = dto.content_md;
    if (dto.round !== undefined) session.round = dto.round;
    if (dto.status !== undefined) session.status = dto.status;
    if (dto.data !== undefined) session.data = dto.data;

    const savedSession = await this.sessionRepository.save(session);

    // Update archives association
    if (dto.archiveIds !== undefined) {
      // 1. Unlink all current archives for this session
      await this.archiveRepository.update(
        { session_id: sessionId },
        { session_id: null as any },
      );

      // 2. Link new list if provided
      if (dto.archiveIds.length > 0) {
        await this.archiveRepository
          .createQueryBuilder()
          .update(Archive)
          .set({ session_id: sessionId })
          .where('id IN (:...ids)', { ids: dto.archiveIds })
          .execute();
      }
    }

    return savedSession;
  }

  /**
   * 세션 삭제 (SUPER_ADMIN 전용)
   */
  async remove(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('세션을 찾을 수 없습니다.');
    }

    await this.sessionRepository.remove(session);

    return { success: true, message: '세션이 삭제되었습니다.' };
  }

  // ==================== Attendance ====================

  /**
   * 출석 목록 조회
   */
  async getAttendance(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('세션을 찾을 수 없습니다.');
    }

    const attendances = await this.attendanceRepository.find({
      where: { session_id: sessionId },
      relations: ['user'],
    });

    return {
      data: attendances.map((a) => ({
        id: a.id,
        session_id: a.session_id,
        user_id: a.user_id,
        status: a.status,
        memo: a.memo,
        updated_by: a.updated_by,
        updated_at: a.updated_at,
        user: {
          id: a.user.id,
          name: a.user.name,
          handle: a.user.handle,
          user_image: a.user.user_image,
        },
      })),
    };
  }

  /**
   * 출석 일괄 수정 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  async updateAttendance(
    sessionId: string,
    dto: BulkUpdateAttendanceDto,
    user: User,
  ) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('세션을 찾을 수 없습니다.');
    }

    // 권한 체크
    await this.checkStudyManagerPermission(session.study_id, user);

    const results: Attendance[] = [];

    for (const item of dto.attendance) {
      let attendance = await this.attendanceRepository.findOne({
        where: { session_id: sessionId, user_id: item.user_id },
      });

      if (attendance) {
        attendance.status = item.status;
        attendance.memo = item.memo || '';
        attendance.updated_by = user.id;
      } else {
        attendance = this.attendanceRepository.create({
          session_id: sessionId,
          user_id: item.user_id,
          status: item.status,
          memo: item.memo || '',
          updated_by: user.id,
        });
      }

      const saved = await this.attendanceRepository.save(attendance);
      results.push(saved);
    }

    return { data: results };
  }

  /**
   * 본인 출석 체크 (MEMBER 전용)
   */
  async checkAttendance(sessionId: string, user: User) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('세션을 찾을 수 없습니다.');
    }

    // Check if user is a member of the study
    const membership = await this.membershipRepository.findOne({
      where: { study_id: session.study_id, user_id: user.id },
    });

    if (!membership) {
      throw new ForbiddenException('스터디 멤버만 출석할 수 있습니다.');
    }

    let attendance = await this.attendanceRepository.findOne({
      where: { session_id: sessionId, user_id: user.id },
    });

    if (attendance) {
      if (attendance.status === AttendanceStatus.PRESENT) {
        // Toggle to UNKNOWN (Cancel attendance)
        attendance.status = AttendanceStatus.UNKNOWN;
      } else {
        // Toggle to PRESENT
        attendance.status = AttendanceStatus.PRESENT;
      }
      attendance.updated_at = new Date();
    } else {
      attendance = this.attendanceRepository.create({
        session_id: sessionId,
        user_id: user.id,
        status: AttendanceStatus.PRESENT,
        memo: '',
        updated_by: user.id,
      });
    }

    return this.attendanceRepository.save(attendance);
  }

  // ==================== Helper Methods ====================

  private async checkStudyManagerPermission(studyId: string, user: User) {
    if (user.role === UserRole.SUPER_ADMIN) {
      return;
    }

    const membership = await this.membershipRepository.findOne({
      where: {
        study_id: studyId,
        user_id: user.id,
        member_role: StudyMemberRole.MANAGER,
      },
    });

    if (!membership) {
      throw new ForbiddenException('이 작업을 수행할 권한이 없습니다.');
    }
  }
}
