import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { User } from '../../entities';
import { ActivityLog } from '../../entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ActivityLog])],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
  exports: [AdminUsersService],
})
export class AdminUsersModule { }
