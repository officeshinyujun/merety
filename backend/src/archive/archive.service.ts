import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Archive,
  ArchiveType,
  ArchiveCategory,
  Study,
  User,
  UserRole,
  StudyMembership,
} from '../entities';
import { StudyMemberRole } from '../entities/study-membership.entity';
import {
  UploadArchiveDto,
  UpdateArchiveDto,
  CreateLinkDto,
  ArchiveQueryDto,
} from './dto/archive.dto';

@Injectable()
export class ArchiveService {
  constructor(
    @InjectRepository(Archive)
    private archiveRepository: Repository<Archive>,
    @InjectRepository(Study)
    private studyRepository: Repository<Study>,
    @InjectRepository(StudyMembership)
    private membershipRepository: Repository<StudyMembership>,
  ) {}

  /**
   * 아카이브 목록 조회
   */
  async findByStudy(studyId: string, query: ArchiveQueryDto) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    const queryBuilder = this.archiveRepository
      .createQueryBuilder('archive')
      .leftJoinAndSelect('archive.uploader', 'uploader')
      .where('archive.study_id = :studyId', { studyId })
      .andWhere('archive.is_deleted = false');

    if (query.category) {
      queryBuilder.andWhere('archive.category = :category', {
        category: query.category,
      });
    }

    if (query.type) {
      queryBuilder.andWhere('archive.type = :type', { type: query.type });
    }

    queryBuilder.orderBy('archive.created_at', 'DESC');

    const archives = await queryBuilder.getMany();

    return {
      data: archives.map((a) => ({
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
        uploader: a.uploader
          ? {
              id: a.uploader.id,
              name: a.uploader.name,
              user_image: a.uploader.user_image,
            }
          : null,
      })),
    };
  }

  /**
   * 파일 업로드 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   * 참고: 실제 파일 스토리지 연동 필요 (S3 등)
   */
  async uploadFile(
    studyId: string,
    dto: UploadArchiveDto,
    file: any,
    user: User,
  ) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    // 권한 체크
    await this.checkStudyManagerPermission(studyId, user);

    // file.filename contains the saved filename (from diskStorage)
    const storageKey = `archives/${file.filename}`;
    const fileUrl = `/uploads/archives/${file.filename}`;

    const archive = this.archiveRepository.create({
      study_id: studyId,
      uploader_id: user.id,
      type: ArchiveType.FILE,
      title: dto.title,
      url: fileUrl,
      storage_key: storageKey,
      category: dto.category,
    });

    const savedArchive = await this.archiveRepository.save(archive);

    return { archive: savedArchive };
  }

  /**
   * 링크 추가 (SUPER_ADMIN 또는 해당 STUDY_MANAGER)
   */
  async createLink(studyId: string, dto: CreateLinkDto, user: User) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    // 권한 체크
    await this.checkStudyManagerPermission(studyId, user);

    const archive = this.archiveRepository.create({
      study_id: studyId,
      uploader_id: user.id,
      type: ArchiveType.LINK,
      title: dto.title,
      url: dto.url,
      category: ArchiveCategory.LINK,
    });

    const savedArchive = await this.archiveRepository.save(archive);

    return { archive: savedArchive };
  }

  async update(archiveId: string, dto: UpdateArchiveDto, user: User) {
    const archive = await this.archiveRepository.findOne({
      where: { id: archiveId, is_deleted: false },
    });

    if (!archive) {
      throw new NotFoundException('아카이브를 찾을 수 없습니다.');
    }

    // 권한 체크: 업로더 본인 또는 스터디 매니저 또는 슈퍼 어드민
    if (user.role !== UserRole.SUPER_ADMIN && archive.uploader_id !== user.id) {
      await this.checkStudyManagerPermission(archive.study_id, user);
    }

    if (dto.title) archive.title = dto.title;
    if (dto.category) archive.category = dto.category;

    return this.archiveRepository.save(archive);
  }

  /**
   * 아카이브 삭제 (SUPER_ADMIN 전용)
   */
  async remove(archiveId: string) {
    const archive = await this.archiveRepository.findOne({
      where: { id: archiveId, is_deleted: false },
    });

    if (!archive) {
      throw new NotFoundException('아카이브를 찾을 수 없습니다.');
    }

    // Soft delete
    archive.is_deleted = true;
    await this.archiveRepository.save(archive);

    return { success: true, message: '아카이브가 삭제되었습니다.' };
  }

  /**
   * 파일 다운로드 정보 조회
   */
  async getDownloadInfo(archiveId: string) {
    const archive = await this.archiveRepository.findOne({
      where: { id: archiveId, is_deleted: false },
    });

    if (!archive) {
      throw new NotFoundException('아카이브를 찾을 수 없습니다.');
    }

    // TODO: 실제 다운로드 URL 생성 로직 (presigned URL 등)
    return {
      id: archive.id,
      title: archive.title,
      url: archive.url,
      type: archive.type,
    };
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
