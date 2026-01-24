import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Study } from './study.entity';
import { User } from './user.entity';
import { Attendance } from './attendance.entity';

export enum SessionStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity('sessions')
@Unique(['study_id', 'session_no'])
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'study_id' })
  study_id: string;

  @ManyToOne(() => Study, (study) => study.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'study_id' })
  study: Study;

  @Column({ type: 'int' })
  session_no: number;

  @Column({ type: 'int', default: 1 })
  round: number;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.ACTIVE,
  })
  status: SessionStatus;

  @Column({ type: 'date', nullable: true })
  scheduled_at: Date;

  @Column({ type: 'text', nullable: true })
  content_md: string;

  @Column({ name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  // Relations
  @OneToMany(() => Attendance, (attendance) => attendance.session)
  attendances: Attendance[];
}
