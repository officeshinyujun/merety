import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Controller('api/inquiry')
export class InquiryController {
    constructor(private readonly emailService: EmailService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async submitInquiry(@Body() createInquiryDto: CreateInquiryDto) {
        const { name, email, title, content, pageUrl } = createInquiryDto;

        const success = await this.emailService.sendInquiryEmail({
            fromName: name,
            fromEmail: email,
            title,
            content,
            pageUrl,
        });

        if (success) {
            return { message: '문의가 성공적으로 전송되었습니다.' };
        } else {
            return { message: '문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.' };
        }
    }
}
