import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Notice, User } from '../entities';
import {
  CreateNoticeDto,
  UpdateNoticeDto,
  NoticeQueryDto,
} from './dto/notices.dto';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
  ) {}

  /**
   * 공지사항 목록 조회
   */
  async findAll(query: NoticeQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.noticeRepository
      .createQueryBuilder('notice')
      .leftJoinAndSelect('notice.creator', 'creator')
      .where('notice.is_deleted = false');

    if (search) {
      queryBuilder.andWhere(
        '(notice.title ILIKE :search OR notice.content_md ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('notice.created_at', 'DESC').skip(skip).take(limit);

    const [notices, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: notices.map((n) => ({
        id: n.id,
        title: n.title,
        content_md: n.content_md,
        created_by: n.created_by,
        created_at: n.created_at,
        updated_at: n.updated_at,
        is_deleted: n.is_deleted,
        createUser: n.creator
          ? {
              name: n.creator.name,
              userImage: n.creator.user_image,
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
   * 공지사항 상세 조회
   */
  async findOne(noticeId: string) {
    const notice = await this.noticeRepository.findOne({
      where: { id: noticeId, is_deleted: false },
      relations: ['creator'],
    });

    if (!notice) {
      throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    }

    return {
      id: notice.id,
      title: notice.title,
      content_md: notice.content_md,
      created_by: notice.created_by,
      created_at: notice.created_at,
      updated_at: notice.updated_at,
      is_deleted: notice.is_deleted,
      createUser: notice.creator
        ? {
            name: notice.creator.name,
            userImage: notice.creator.user_image,
          }
        : null,
    };
  }

  /**
   * 공지사항 작성 (SUPER_ADMIN 전용)
   */
  async create(dto: CreateNoticeDto, user: User) {
    const notice = this.noticeRepository.create({
      title: dto.title,
      content_md: dto.content_md,
      created_by: user.id,
    });

    const savedNotice = await this.noticeRepository.save(notice);

    return savedNotice;
  }

  /**
   * 공지사항 수정 (SUPER_ADMIN 전용)
   */
  async update(noticeId: string, dto: UpdateNoticeDto) {
    const notice = await this.noticeRepository.findOne({
      where: { id: noticeId, is_deleted: false },
    });

    if (!notice) {
      throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    }

    if (dto.title !== undefined) notice.title = dto.title;
    if (dto.content_md !== undefined) notice.content_md = dto.content_md;

    const savedNotice = await this.noticeRepository.save(notice);

    return savedNotice;
  }

  /**
   * 공지사항 삭제 (SUPER_ADMIN 전용)
   */
  async remove(noticeId: string) {
    const notice = await this.noticeRepository.findOne({
      where: { id: noticeId, is_deleted: false },
    });

    if (!notice) {
      throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    }

    // Soft delete
    notice.is_deleted = true;
    await this.noticeRepository.save(notice);

    return { success: true, message: '공지사항이 삭제되었습니다.' };
  }
}
