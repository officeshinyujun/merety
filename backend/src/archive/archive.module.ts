import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchiveController } from './archive.controller';
import { ArchiveService } from './archive.service';
import { Archive, Study, StudyMembership } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Archive, Study, StudyMembership])],
  controllers: [ArchiveController],
  providers: [ArchiveService],
  exports: [ArchiveService],
})
export class ArchiveModule {}
