
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleDescription } from '../entities/role-description.entity';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class RoleDescriptionsService {
    constructor(
        @InjectRepository(RoleDescription)
        private readonly roleDescriptionRepository: Repository<RoleDescription>,
    ) { }

    async findAll() {
        return this.roleDescriptionRepository.find();
    }

    async update(role: UserRole, description: string) {
        let roleDesc = await this.roleDescriptionRepository.findOneBy({ role });
        if (!roleDesc) {
            roleDesc = this.roleDescriptionRepository.create({ role, description });
        } else {
            roleDesc.description = description;
        }
        return this.roleDescriptionRepository.save(roleDesc);
    }
}
