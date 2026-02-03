import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from '../entities';
import { ActivityLoggerService } from './services/activity-logger.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  providers: [ActivityLoggerService],
  exports: [ActivityLoggerService],
})
export class CommonModule {}
