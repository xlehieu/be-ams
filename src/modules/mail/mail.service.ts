// mail/mail.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<string>('SMTP_SECURE') === 'true', // true nếu dùng port 465
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }
  constructor(private readonly configService: ConfigService) {}
  private async renderTemplate(
    templateName: string,
    data: Record<string, any>,
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.ejs`,
    );
    return ejs.renderFile(templatePath, data);
  }
  async senEmailWelcome(data: any,topic?:string) {
    try {
      const html = await this.renderTemplate('welcome', {
        name: data.name ?? data.email,
        email: data.email,
      });

      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to: data.email,
        subject: 'Chào mừng bạn đến với hệ thống',
        html,
      });

      this.logger.log(`Topic: ${topic} ${data.email}`);
    } catch (err) {
      this.logger.error(`Lỗi topic:${topic} ${data.email}`, err);
    }
  }
}
