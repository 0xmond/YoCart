import { Injectable } from '@nestjs/common';
import { transporter } from 'src/common/config/email.config';

@Injectable()
export class EmailService {
  async sendEmail(to: string, subject: string, html: string) {
    await transporter.sendMail({
      from: `"E-Commerce"<${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });
  }
}
