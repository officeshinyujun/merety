import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StudyMembership } from './study-membership.entity';
import { TilPost } from './til-post.entity';
import { Notice } from './notice.entity';
import { Archive } from './archive.entity';
import { ActivityLog } from './activity-log.entity';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  STUDY_MANAGER = 'STUDY_MANAGER',
  MEMBER = 'MEMBER',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  handle: string;

  @Column({ nullable: true })
  user_image: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ default: true })
  must_change_password: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  // Relations
  @OneToMany(() => StudyMembership, (membership) => membership.user)
  study_memberships: StudyMembership[];

  @OneToMany(() => TilPost, (til) => til.author)
  til_posts: TilPost[];

  @OneToMany(() => Notice, (notice) => notice.creator)
  notices: Notice[];

  @OneToMany(() => Archive, (archive) => archive.uploader)
  archives: Archive[];

  @OneToMany(() => ActivityLog, (log) => log.user)
  activity_logs: ActivityLog[];
}
