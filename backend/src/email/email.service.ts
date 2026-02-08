import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  // Convert markdown to HTML for email display
  private convertMarkdownToHtml(markdown: string): string {
    let html = markdown;

    // Convert images: ![alt](url) -> <img src="url" alt="alt" />
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" />'
    );

    // Convert links: [text](url) -> <a href="url">text</a>
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" style="color: #3b82f6;">$1</a>'
    );

    // Convert bold: **text** or __text__ -> <strong>text</strong>
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // Convert italic: *text* or _text_ -> <em>text</em>
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Convert line breaks
    html = html.replace(/\n/g, '<br />');

    return html;
  }

  async sendInquiryEmail(data: {
    fromName: string;
    fromEmail: string;
    title: string;
    content: string;
    pageUrl?: string;
  }): Promise<boolean> {
    const { fromName, fromEmail, title, content, pageUrl } = data;

    // Convert markdown content to HTML
    const htmlContent = this.convertMarkdownToHtml(content);

    const mailOptions = {
      from: `"${fromName}" <${this.configService.get<string>('GMAIL_USER')}>`,
      to: this.configService.get<string>('INQUIRY_EMAIL') || 'officeshinyujun@gmail.com',
      replyTo: fromEmail,
      subject: `[문의] ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
            새로운 문의가 도착했습니다
          </h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>보낸 사람:</strong> ${fromName}</p>
            <p><strong>이메일:</strong> ${fromEmail}</p>
            <p><strong>제목:</strong> ${title}</p>
            ${pageUrl ? `<p><strong>작성 페이지:</strong> <a href="${pageUrl}">${pageUrl}</a></p>` : ''}
          </div>
          <div style="padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="margin-top: 0;">문의 내용:</h3>
            <div>${htmlContent}</div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            이 이메일은 404bnf 웹사이트에서 자동 발송되었습니다.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}
