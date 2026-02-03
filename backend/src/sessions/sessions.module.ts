import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { Session, Attendance, Study, StudyMembership, Archive } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Attendance, Study, StudyMembership, Archive]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
