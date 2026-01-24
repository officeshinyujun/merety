import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserStatus } from '../../../entities';

/**
 * 유저 생성 DTO
 */
export class CreateUserDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수입니다.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '핸들은 필수입니다.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '핸들은 영문, 숫자, 언더스코어만 사용할 수 있습니다.',
  })
  handle: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: '유효하지 않은 역할입니다.' })
  role?: UserRole;
}

/**
 * 유저 수정 DTO
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: '유효하지 않은 역할입니다.' })
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus, { message: '유효하지 않은 상태입니다.' })
  status?: UserStatus;

  @IsOptional()
  @IsString()
  userImage?: string;
}

/**
 * 유저 목록 조회 쿼리 DTO
 */
export class UserQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
