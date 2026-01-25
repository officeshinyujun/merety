import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SessionStatus } from '../../entities/session.entity';
import { AttendanceStatus } from '../../entities/attendance.entity';

// ==================== Session DTOs ====================

export class CreateSessionDto {
  @IsString()
  title: string;

  @IsDateString()
  scheduled_at: string;

  @IsOptional()
  @IsString()
  content_md?: string;

  @IsOptional()
  data?: {
    materials?: string[];
  };
}

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  scheduled_at?: string;

  @IsOptional()
  @IsString()
  content_md?: string;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  data?: {
    materials?: string[];
  };
}

export class SessionQueryDto {
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;
}

// ==================== Attendance DTOs ====================

export class AttendanceItemDto {
  @IsUUID()
  user_id: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  memo?: string;
}

export class BulkUpdateAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceItemDto)
  attendance: AttendanceItemDto[];
}
