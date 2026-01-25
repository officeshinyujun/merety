import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TilController } from './til.controller';
import { TilService } from './til.service';
import { TilPost, Study, StudyMembership } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([TilPost, Study, StudyMembership])],
  controllers: [TilController],
  providers: [TilService],
  exports: [TilService],
})
export class TilModule {}
