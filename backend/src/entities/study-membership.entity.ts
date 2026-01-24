import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Study } from './study.entity';
import { User } from './user.entity';

export enum StudyMemberRole {
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

@Entity('study_memberships')
@Unique(['study_id', 'user_id'])
export class StudyMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'study_id' })
  study_id: string;

  @ManyToOne(() => Study, (study) => study.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'study_id' })
  study: Study;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.study_memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: StudyMemberRole,
    default: StudyMemberRole.MEMBER,
  })
  member_role: StudyMemberRole;

  @CreateDateColumn()
  joined_at: Date;
}
