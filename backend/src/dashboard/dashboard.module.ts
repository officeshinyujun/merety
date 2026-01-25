import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import {
  Study,
  StudyMembership,
  Session,
  TilPost,
  ActivityLog,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Study,
      StudyMembership,
      Session,
      TilPost,
      ActivityLog,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
