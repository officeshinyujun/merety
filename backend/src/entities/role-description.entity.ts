import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';
import { UserRole } from './user.entity';

@Entity('role_descriptions')
export class RoleDescription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        unique: true,
    })
    role: UserRole;

    @Column('text')
    description: string;

    @UpdateDateColumn()
    updated_at: Date;
}
