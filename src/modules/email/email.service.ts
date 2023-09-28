import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendUserWelcome(user: any, password: string) {
        const confirmation_url = `example.com/auth/confirm?email=${user.email}&password=${password}`;
    
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Welcome to Suite Mate! Confirm your Email',
          template: './welcome', // `.ejs` extension is appended automatically
          context: { // filling <%= %> brackets with content
            name: `${user.first_name} ${user.last_name}`,
            confirmation_url,
            default_password: password
          },
        });
      }

}
