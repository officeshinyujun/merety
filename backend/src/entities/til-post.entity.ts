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

export enum TilCategory {
  TIL = 'TIL',
  WIL = 'WIL',
}

@Entity('til_posts')
export class TilPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TilCategory,
    default: TilCategory.TIL,
  })
  category: TilCategory;

  @Column({ name: 'study_id', nullable: true })
  study_id: string | null;

  @ManyToOne(() => Study, (study) => study.til_posts, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'study_id' })
  study: Study | null;

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
