import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Study } from './study.entity';
import { User } from './user.entity';

export enum ArchiveType {
  FILE = 'FILE',
  LINK = 'LINK',
}

export enum ArchiveCategory {
  SLIDE = 'SLIDE',
  DOC = 'DOC',
  CODE = 'CODE',
  LINK = 'LINK',
  ETC = 'ETC',
}

@Entity('archives')
export class Archive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'study_id' })
  study_id: string;

  @ManyToOne(() => Study, (study) => study.archives, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'study_id' })
  study: Study;

  @Column({ name: 'uploader_id' })
  uploader_id: string;

  @ManyToOne(() => User, (user) => user.archives)
  @JoinColumn({ name: 'uploader_id' })
  uploader: User;

  @Column({
    type: 'enum',
    enum: ArchiveType,
  })
  type: ArchiveType;

  @Column()
  title: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  storage_key: string;

  @Column({
    type: 'enum',
    enum: ArchiveCategory,
  })
  category: ArchiveCategory;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
