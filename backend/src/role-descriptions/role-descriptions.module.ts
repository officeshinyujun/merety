import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleDescriptionsService } from './role-descriptions.service';
import { RoleDescriptionsController } from './role-descriptions.controller';
import { RoleDescription } from '../entities/role-description.entity';

@Module({
    imports: [TypeOrmModule.forFeature([RoleDescription])],
    controllers: [RoleDescriptionsController],
    providers: [RoleDescriptionsService],
    exports: [RoleDescriptionsService],
})
export class RoleDescriptionsModule { }
