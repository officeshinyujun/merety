import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog, ActionType, EntityType } from '../../entities';

@Injectable()
export class ActivityLoggerService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  /**
   * Log an activity
   */
  async logActivity(
    userId: string,
    actionType: ActionType,
    entityType: EntityType,
    entityId?: string,
    meta?: Record<string, any>,
  ): Promise<void> {
    try {
      const log = this.activityLogRepository.create({
        user_id: userId,
        action_type: actionType,
        entity_type: entityType,
        entity_id: entityId,
        meta: meta || {},
      });
      await this.activityLogRepository.save(log);
    } catch (error) {
      // Log error but don't throw to avoid breaking main operations
      console.error('Failed to log activity:', error);
    }
  }
}
