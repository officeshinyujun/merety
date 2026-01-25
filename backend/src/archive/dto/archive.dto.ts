import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { ArchiveType, ArchiveCategory } from '../../entities/archive.entity';

export class UploadArchiveDto {
  @IsString()
  title: string;

  @IsEnum(ArchiveCategory)
  category: ArchiveCategory;
}

export class CreateLinkDto {
  @IsString()
  title: string;

  @IsUrl()
  url: string;
}

export class ArchiveQueryDto {
  @IsOptional()
  @IsEnum(ArchiveCategory)
  category?: ArchiveCategory;

  @IsOptional()
  @IsEnum(ArchiveType)
  type?: ArchiveType;
}
