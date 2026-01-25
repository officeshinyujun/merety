import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TilPost, Study, User, UserRole, StudyMembership } from '../entities';
import { StudyMemberRole } from '../entities/study-membership.entity';
import { CreateTilDto, UpdateTilDto, TilQueryDto } from './dto/til.dto';

@Injectable()
export class TilService {
  constructor(
    @InjectRepository(TilPost)
    private tilRepository: Repository<TilPost>,
    @InjectRepository(Study)
    private studyRepository: Repository<Study>,
    @InjectRepository(StudyMembership)
    private membershipRepository: Repository<StudyMembership>,
  ) {}

  /**
   * TIL/WIL 목록 조회
   */
  async findByStudy(studyId: string, query: TilQueryDto, currentUser: User) {
    const { page = 1, limit = 10, author_id, tag, mine } = query;
    const skip = (page - 1) * limit;

    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    const queryBuilder = this.tilRepository
      .createQueryBuilder('til')
      .leftJoinAndSelect('til.author', 'author')
      .where('til.study_id = :studyId', { studyId })
      .andWhere('til.is_deleted = false');

    if (author_id) {
      queryBuilder.andWhere('til.author_id = :author_id', { author_id });
    }

    if (mine) {
      queryBuilder.andWhere('til.author_id = :userId', {
        userId: currentUser.id,
      });
    }

    if (tag) {
      queryBuilder.andWhere(':tag = ANY(til.tags)', { tag });
    }

    queryBuilder.orderBy('til.created_at', 'DESC').skip(skip).take(limit);

    const [tils, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: tils.map((t) => ({
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
        createUser: t.author
          ? {
              name: t.author.name,
              userImage: t.author.user_image,
            }
          : null,
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
   * TIL/WIL 상세 조회
   */
  async findOne(postId: string) {
    const til = await this.tilRepository.findOne({
      where: { id: postId, is_deleted: false },
      relations: ['author'],
    });

    if (!til) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return {
      id: til.id,
      study_id: til.study_id,
      author_id: til.author_id,
      author_name: til.author?.name || '',
      author_image: til.author?.user_image || '',
      title: til.title,
      content_md: til.content_md,
      tags: til.tags,
      created_at: til.created_at,
      updated_at: til.updated_at,
      is_deleted: til.is_deleted,
      createUser: til.author
        ? {
            name: til.author.name,
            userImage: til.author.user_image,
          }
        : null,
    };
  }

  /**
   * TIL/WIL 작성 (스터디 참여자)
   */
  async create(studyId: string, dto: CreateTilDto, user: User) {
    const study = await this.studyRepository.findOne({
      where: { id: studyId },
    });

    if (!study) {
      throw new NotFoundException('스터디를 찾을 수 없습니다.');
    }

    // 스터디 멤버인지 확인 (SUPER_ADMIN은 항상 허용)
    if (user.role !== UserRole.SUPER_ADMIN) {
      const membership = await this.membershipRepository.findOne({
        where: { study_id: studyId, user_id: user.id },
      });

      if (!membership) {
        throw new ForbiddenException('스터디 멤버만 글을 작성할 수 있습니다.');
      }
    }

    const til = this.tilRepository.create({
      study_id: studyId,
      author_id: user.id,
      title: dto.title,
      content_md: dto.content_md,
      tags: dto.tags || [],
    });

    const savedTil = await this.tilRepository.save(til);

    return savedTil;
  }

  /**
   * TIL/WIL 수정 (작성자 본인 또는 SUPER_ADMIN)
   */
  async update(postId: string, dto: UpdateTilDto, user: User) {
    const til = await this.tilRepository.findOne({
      where: { id: postId, is_deleted: false },
    });

    if (!til) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 권한 체크
    if (til.author_id !== user.id && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('이 게시글을 수정할 권한이 없습니다.');
    }

    if (dto.title !== undefined) til.title = dto.title;
    if (dto.content_md !== undefined) til.content_md = dto.content_md;
    if (dto.tags !== undefined) til.tags = dto.tags;

    const savedTil = await this.tilRepository.save(til);

    return savedTil;
  }

  /**
   * TIL/WIL 삭제 (작성자 본인 또는 SUPER_ADMIN)
   */
  async remove(postId: string, user: User) {
    const til = await this.tilRepository.findOne({
      where: { id: postId, is_deleted: false },
    });

    if (!til) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 권한 체크
    if (til.author_id !== user.id && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('이 게시글을 삭제할 권한이 없습니다.');
    }

    // Soft delete
    til.is_deleted = true;
    await this.tilRepository.save(til);

    return { success: true, message: '게시글이 삭제되었습니다.' };
  }
}
