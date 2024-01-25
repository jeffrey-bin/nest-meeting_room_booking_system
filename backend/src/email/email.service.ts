import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('nodemailer_host'),
      port: this.configService.get('nodemailer_port'),
      secure: false,
      auth: {
        user: this.configService.get('nodemailer_auth_user'),
        pass: this.configService.get('nodemailer_auth_pass'),
      },
    });
  }

  async send(to: string, subject: string, html: string) {
    // 检查邮箱格式是否正确
    const emailReg = new RegExp(
      /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/,
    );
    if (!emailReg.test(to)) {
      throw new Error('邮箱格式不正确');
    }

    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: '707772620@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}
