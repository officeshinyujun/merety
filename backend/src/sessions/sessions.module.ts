import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { Session, Attendance, Study, StudyMembership } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Attendance, Study, StudyMembership]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
