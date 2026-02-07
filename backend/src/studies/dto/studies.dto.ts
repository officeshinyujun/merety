import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
} from 'class-validator';
import { StudyStatus } from '../../entities';
import { StudyMemberRole } from '../../entities/study-membership.entity';

// ==================== Study DTOs ====================

export class CreateStudyDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  overview?: {
    description: string;
  };

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  manager_ids?: string[];
}

export class UpdateStudyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(StudyStatus)
  status?: StudyStatus;
}

export class StudyQueryDto {
  @IsOptional()
  @IsEnum(StudyStatus)
  status?: StudyStatus;

  @IsOptional()
  @IsString()
  type?: string;
}

// ==================== Overview DTOs ====================

export class UpdateOverviewDto {
  @IsString()
  description: string;
}

// ==================== Member DTOs ====================

export class AddMemberDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsEnum(StudyMemberRole)
  member_role?: StudyMemberRole;
}

export class UpdateMemberRoleDto {
  @IsEnum(StudyMemberRole)
  member_role: StudyMemberRole;
}
