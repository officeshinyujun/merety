import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInquiryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    pageUrl?: string;
}
