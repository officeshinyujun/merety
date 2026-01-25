import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import {
  Study,
  StudyOverview,
  StudyMembership,
  User,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Study,
      StudyOverview,
      StudyMembership,
      User,
    ]),
  ],
  controllers: [StudiesController],
  providers: [StudiesService],
  exports: [StudiesService],
})
export class StudiesModule {}
