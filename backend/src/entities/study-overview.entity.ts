import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Study } from './study.entity';
import { User } from './user.entity';

@Entity('study_overview')
export class StudyOverview {
  @PrimaryColumn('uuid')
  study_id: string;

  @OneToOne(() => Study, (study) => study.overview, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'study_id' })
  study: Study;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'updated_by', nullable: true })
  updated_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @UpdateDateColumn()
  updated_at: Date;
}
