import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Study,
  StudyOverview,
  StudyMembership,
  User,
  UserRole,
  StudyStatus,
} from '../entities';
import { StudyMemberRole } from '../entities/study-membership.entity';
import {
  CreateStudyDto,
  UpdateStudyDto,
  StudyQueryDto,
  UpdateOverviewDto,
  AddMemberDto,
  UpdateMemberRoleDto,
} from './dto/studies.dto';

@Injectable()
export class StudiesService {
  constructor(
    @InjectRepository(Study)
    private studyRepository: Repository<Study>,
    @InjectRepository(StudyOverview)
    private overviewRepository: Repository<StudyOverview>,
    @InjectRepository(StudyMembership)
    private membershipRepository: Repository<StudyMembership>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  // ==================== Studies CRUD ====================

  /**
   * 스터디 목록 조회
   */
  async findAll(query: StudyQueryDto) {
    const { status, type } = query;

    const queryBuilder = this.studyRepository
      .createQueryBuilder('study')
      .leftJoinAndSelect('study.overview', 'overview')
      .leftJoin('study.memberships', 'memberships')
      .addSelect('COUNT(memberships.id)', 'member_count')
      .groupBy('study.id')
      .addGroupBy('overview.study_id');

    if (status) {
      queryBuilder.andWhere('study.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('study.type = :type', { type });
    }

    queryBuilder.orderBy('study.created_at', 'DESC');

    const studies = await queryBuilder.getRawAndEntities();

    // 멤버 수를 포함한 결과 구성
    const data = studies.entities.map((study, index) => ({
      ...study,
      member_count: parseInt(studies.raw[index].member_count || '0', 10),
    }));

    return { data };
  }

  /**
   * 스터디 상세 조회
   */
  async findOne(studyId: string) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
      relations: [
        'overview',
        'memberships',
        'memberships.user',
        'sessions',
        'til_posts',
        'til_posts.author',
        'archives',
      ],
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    // Manager 목록 구성
    const managerList = study.memberships
      .filter((m) => m.member_role === StudyMemberRole.MANAGER)
      .map((m) => ({
        id: m.user.id,
        name: m.user.name,
        role: m.member_role,
        profileImage: m.user.user_image,
      }));

    // 응답 구성
    const overview = study.overview
      ? {
        description: study.overview.description,
        manager_list: managerList,
      }
      : { description: '', manager_list: managerList };

    // 멤버 목록 구성
    const members = study.memberships.map((m) => ({
      id: m.id,
      user: {
        id: m.user.id,
        email: m.user.email,
        name: m.user.name,
        handle: m.user.handle,
        user_image: m.user.user_image,
        role: m.user.role,
        status: m.user.status,
      },
      member_role: m.member_role,
      joined_at: m.joined_at,
    }));

    // WIL 목록 구성
    const wil = study.til_posts
      .filter((t) => !t.is_deleted)
      .map((t) => ({
        id: t.id,
        study_id: t.study_id,
        author_id: t.author_id,
        author_name: t.author?.name || '',
        author_image: t.author?.user_image || '',
        title: t.title,
        content_md: t.content_md,
        tags: t.tags,
        created_at: t.created_at,
        updated_at: t.updated_at,
        is_deleted: t.is_deleted,
      }));

    // Archive 목록 구성
    const archives = study.archives
      .filter((a) => !a.is_deleted)
      .map((a) => ({
        id: a.id,
        study_id: a.study_id,
        uploader_id: a.uploader_id,
        type: a.type,
        title: a.title,
        url: a.url,
        storage_key: a.storage_key,
        category: a.category,
        created_at: a.created_at,
        is_deleted: a.is_deleted,
      }));

    return {
      id: study.id,
      name: study.name,
      type: study.type,
      slug: study.slug,
      status: study.status,
      created_by: study.created_by,
      created_at: study.created_at,
      updated_at: study.updated_at,
      overview,
      sessions: study.sessions || [],
      members,
      wil,
      archives,
      color: study.color, // Add color to response
    };
  }

  /**
   * 스터디 생성 (SUPER_ADMIN 전용)
   */
  async create(dto: CreateStudyDto, userId: string) {
    const { name, type, slug, overview, manager_ids } = dto;

    // 스터디 생성
    const study = this.studyRepository.create({
      name,
      type,
      color: dto.color,
      slug: slug || this.generateSlug(name),
      status: StudyStatus.ACTIVE,
      created_by: userId,
    });

    const savedStudy = await this.studyRepository.save(study);

    // Overview 생성
    if (overview?.description) {
      const studyOverview = this.overviewRepository.create({
        study_id: savedStudy.id,
        description: overview.description,
        updated_by: userId,
      });
      await this.overviewRepository.save(studyOverview);
    }

    // 담당자(MANAGER) 지정
    if (manager_ids && manager_ids.length > 0) {
      for (const managerId of manager_ids) {
        const membership = this.membershipRepository.create({
          study_id: savedStudy.id,
          user_id: managerId,
          member_role: StudyMemberRole.MANAGER,
        });
        await this.membershipRepository.save(membership);
      }
    }

    return { study: savedStudy };
  }

  /**
   * 스터디 수정 (SUPER_ADMIN 전용)
   */
  async update(studyId: string, dto: UpdateStudyDto) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    if (dto.name !== undefined) study.name = dto.name;
    if (dto.type !== undefined) study.type = dto.type;
    if (dto.color !== undefined) study.color = dto.color;
    if (dto.slug !== undefined) study.slug = dto.slug;
    if (dto.status !== undefined) study.status = dto.status;

    const savedStudy = await this.studyRepository.save(study);

    return { study: savedStudy };
  }

  /**
   * 스터디 삭제 (SUPER_ADMIN 전용, Soft Delete)
   */
  async remove(studyId: string) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    // Soft delete - archived 상태로 변경
    study.status = StudyStatus.ARCHIVED;
    await this.studyRepository.save(study);

    return { success: true, message: '스터디가 삭제(보관)되었습니다.' };
  }

  // ==================== Overview ====================

  /**
   * Overview 조회
   */
  async getOverview(studyId: string) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
      relations: ['overview', 'memberships', 'memberships.user'],
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    const managerList = study.memberships
      .filter((m) => m.member_role === StudyMemberRole.MANAGER)
      .map((m) => ({
        id: m.user.id,
        name: m.user.name,
        role: m.member_role,
        profileImage: m.user.user_image,
      }));

    return {
      description: study.overview?.description || '',
      manager_list: managerList,
    };
  }

  /**
   * Overview 수정 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  async updateOverview(studyId: string, dto: UpdateOverviewDto, user: User) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    // 권한 체크
    await this.checkStudyManagerPermission(studyId, user);

    // Overview 업데이트 또는 생성
    let overview = await this.overviewRepository.findOne({
      where: { study_id: studyId },
    });

    if (overview) {
      overview.description = dto.description;
      overview.updated_by = user.id;
    } else {
      overview = this.overviewRepository.create({
        study_id: studyId,
        description: dto.description,
        updated_by: user.id,
      });
    }

    await this.overviewRepository.save(overview);

    return { description: overview.description };
  }

  // ==================== Members ====================

  /**
   * 멤버 목록 조회
   */
  async getMembers(studyId: string) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    const memberships = await this.membershipRepository.find({
      where: { study_id: studyId },
      relations: ['user'],
      order: { joined_at: 'ASC' },
    });

    const data = memberships.map((m) => ({
      id: m.id,
      user: {
        id: m.user.id,
        email: m.user.email,
        name: m.user.name,
        handle: m.user.handle,
        user_image: m.user.user_image,
        role: m.user.role,
        status: m.user.status,
      },
      member_role: m.member_role,
      joined_at: m.joined_at,
    }));

    return { data };
  }

  /**
   * 멤버 추가 (SUPER_ADMIN 전용)
   */
  async addMember(studyId: string, dto: AddMemberDto) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: dto.user_id },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 이미 멤버인지 확인
    const existingMembership = await this.membershipRepository.findOne({
      where: { study_id: studyId, user_id: dto.user_id },
    });

    if (existingMembership) {
      throw new ConflictException('이미 스터디의 멤버입니다.');
    }

    const membership = this.membershipRepository.create({
      study_id: studyId,
      user_id: dto.user_id,
      member_role: dto.member_role || StudyMemberRole.MEMBER,
    });

    const savedMembership = await this.membershipRepository.save(membership);

    return {
      id: savedMembership.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        handle: user.handle,
        user_image: user.user_image,
      },
      member_role: savedMembership.member_role,
      joined_at: savedMembership.joined_at,
    };
  }

  /**
   * 멤버 역할 변경 (SUPER_ADMIN 전용)
   */
  async updateMemberRole(
    studyId: string,
    userId: string,
    dto: UpdateMemberRoleDto,
  ) {
    const membership = await this.membershipRepository.findOne({
      where: { study_id: studyId, user_id: userId },
      relations: ['user'],
    });

    if (!membership) {
      throw new NotFoundException('스터디 멤버를 찾을 수 없습니다.');
    }

    membership.member_role = dto.member_role;
    const savedMembership = await this.membershipRepository.save(membership);

    return {
      id: savedMembership.id,
      user: {
        id: membership.user.id,
        email: membership.user.email,
        name: membership.user.name,
        handle: membership.user.handle,
        user_image: membership.user.user_image,
      },
      member_role: savedMembership.member_role,
      joined_at: savedMembership.joined_at,
    };
  }

  /**
   * 멤버 제거 (SUPER_ADMIN 전용)
   */
  async removeMember(studyId: string, userId: string) {
    const membership = await this.membershipRepository.findOne({
      where: { study_id: studyId, user_id: userId },
    });

    if (!membership) {
      throw new NotFoundException('스터디 멤버를 찾을 수 없습니다.');
    }

    await this.membershipRepository.remove(membership);

    return { success: true, message: '멤버가 제거되었습니다.' };
  }

  // ==================== Helper Methods ====================

  /**
   * SUPER_ADMIN 또는 해당 스터디의 MANAGER인지 확인
   */
  private async checkStudyManagerPermission(studyId: string, user: User) {
    // SUPER_ADMIN은 항상 허용
    if (user.role === UserRole.SUPER_ADMIN) {
      return;
    }

    // 해당 스터디의 MANAGER인지 확인
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

  /**
   * 스터디 이름에서 slug 생성
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
