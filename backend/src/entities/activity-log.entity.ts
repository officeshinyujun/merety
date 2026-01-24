import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export enum EntityType {
  USER = 'USER',
  STUDY = 'STUDY',
  SESSION = 'SESSION',
  TIL_POST = 'TIL_POST',
  ARCHIVE = 'ARCHIVE',
  NOTICE = 'NOTICE',
  ATTENDANCE = 'ATTENDANCE',
}

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  user_id: string;

  @ManyToOne(() => User, (user) => user.activity_logs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  action_type: ActionType;

  @Column({
    type: 'enum',
    enum: EntityType,
  })
  entity_type: EntityType;

  @Column({ type: 'uuid', nullable: true })
  entity_id: string;

  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}
