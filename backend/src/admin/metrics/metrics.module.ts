import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import {
  Study,
  StudyMembership,
  Session,
  TilPost,
  Attendance,
} from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Study,
      StudyMembership,
      Session,
      TilPost,
      Attendance,
    ]),
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
