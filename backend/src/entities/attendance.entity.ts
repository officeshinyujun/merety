import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Session } from './session.entity';
import { User } from './user.entity';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  UNKNOWN = 'UNKNOWN',
}

@Entity('attendance')
@Unique(['session_id', 'user_id'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  session_id: string;

  @ManyToOne(() => Session, (session) => session.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.UNKNOWN,
  })
  status: AttendanceStatus;

  @Column({ type: 'text', nullable: true })
  memo: string;

  @Column({ name: 'updated_by', nullable: true })
  updated_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn()
  updated_at: Date;
}
