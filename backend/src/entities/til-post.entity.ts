import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Study } from './study.entity';
import { User } from './user.entity';

@Entity('til_posts')
export class TilPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'study_id' })
  study_id: string;

  @ManyToOne(() => Study, (study) => study.til_posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'study_id' })
  study: Study;

  @Column({ name: 'author_id' })
  author_id: string;

  @ManyToOne(() => User, (user) => user.til_posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content_md: string;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
