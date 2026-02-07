import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { StudyMembership } from './study-membership.entity';
import { StudyOverview } from './study-overview.entity';
import { Session } from './session.entity';
import { TilPost } from './til-post.entity';
import { Archive } from './archive.entity';



export enum StudyStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity('studies')
export class Study {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, default: 'WEB' })
  type: string;

  @Column({ default: '#ffffff' })
  color: string;

  @Column({ nullable: true, type: 'text' })
  slug: string;

  @Column({
    type: 'enum',
    enum: StudyStatus,
    default: StudyStatus.ACTIVE,
  })
  status: StudyStatus;

  @Column({ name: 'created_by' })
  created_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => StudyOverview, (overview) => overview.study, { cascade: true })
  overview: StudyOverview;

  @OneToMany(() => StudyMembership, (membership) => membership.study)
  memberships: StudyMembership[];

  @OneToMany(() => Session, (session) => session.study)
  sessions: Session[];

  @OneToMany(() => TilPost, (til) => til.study)
  til_posts: TilPost[];

  @OneToMany(() => Archive, (archive) => archive.study)
  archives: Archive[];
}
