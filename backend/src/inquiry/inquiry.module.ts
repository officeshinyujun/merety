import { Module } from '@nestjs/common';
import { InquiryController } from './inquiry.controller';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [EmailModule],
    controllers: [InquiryController],
})
export class InquiryModule { }
