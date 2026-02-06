import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { User, UserRole, UserStatus } from '../../entities';
import { ActivityLog } from '../../entities/activity-log.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto/admin-users.dto';
import {
  generateTemporaryPassword,
  hashPassword,
} from '../../common/utils/password.util';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) { }

  /**
   * 유저 목록 조회 (페이지네이션, 검색, 필터링)
   */
  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 10, search, role, status } = query;
    const skip = (page - 1) * limit;

    // 필터 조건 설정
    const where: FindOptionsWhere<User>[] = [];

    const baseCondition: FindOptionsWhere<User> = {};
    if (role) baseCondition.role = role;
    if (status) baseCondition.status = status;

    if (search) {
      // 이름 또는 이메일로 검색
      where.push(
        { ...baseCondition, name: Like(`%${search}%`) },
        { ...baseCondition, email: Like(`%${search}%`) },
        { ...baseCondition, handle: Like(`%${search}%`) },
      );
    } else {
      where.push(baseCondition);
    }

    // 쿼리 실행
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
        'must_change_password',
        'created_at',
        'updated_at',
        'last_login_at',
      ],
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
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
   * 유저 생성
   */
  async create(dto: CreateUserDto) {
    const { email, handle, name, role = UserRole.MEMBER } = dto;

    // 이메일 중복 체크
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 핸들 중복 체크
    const existingHandle = await this.userRepository.findOne({
      where: { handle },
    });
    if (existingHandle) {
      throw new ConflictException('이미 사용 중인 핸들입니다.');
    }

    // 임시 비밀번호 생성
    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    // 유저 생성
    const user = this.userRepository.create({
      email,
      handle,
      name,
      role,
      password_hash: passwordHash,
      must_change_password: true,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.userRepository.save(user);

    // 민감한 정보 제거
    const { password_hash, ...userWithoutPassword } = savedUser;

    return {
      user: userWithoutPassword,
      temporary_password: temporaryPassword,
    };
  }

  /**
   * 유저 정보 수정
   */
  async update(userId: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 수정 가능한 필드 업데이트
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.status !== undefined) user.status = dto.status;
    if (dto.userImage !== undefined) user.user_image = dto.userImage;

    const savedUser = await this.userRepository.save(user);

    // 민감한 정보 제거
    const { password_hash, ...userWithoutPassword } = savedUser;

    return {
      user: userWithoutPassword,
    };
  }

  /**
   * 비밀번호 초기화
   */
  async resetPassword(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 새 임시 비밀번호 생성
    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    // 비밀번호 업데이트
    await this.userRepository.update(userId, {
      password_hash: passwordHash,
      must_change_password: true,
    });

    return {
      temporary_password: temporaryPassword,
      must_change_password: true,
    };
  }

  /**
   * 유저 삭제 (Hard Delete - 완전 삭제)
   */
  async remove(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 관련 데이터 삭제 (외래 키 제약 조건 해결)
    // 1. Activity logs 삭제
    await this.activityLogRepository.delete({ user_id: userId });

    // 2. 유저 삭제
    await this.userRepository.delete(userId);

    return { success: true, message: '유저가 완전히 삭제되었습니다.' };
  }
}
