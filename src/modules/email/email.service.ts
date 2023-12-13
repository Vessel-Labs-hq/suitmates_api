import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendUserWelcome(email: any, password: string) {
        const confirmation_url = ` https://beta.tenant.mysuitemates.com/auth/verify?email=${email}&password=${password}`;
    
        await this.mailerService.sendMail({
          to: email,
          subject: 'Welcome to Suite Mate! Confirm your Email',
          template: '../../../mail/templates/welcome', // `.ejs` extension is appended automatically
          context: { // filling <%= %> brackets with content
            name: ``,
            confirmation_url,
            default_password: password
          },
        });
      }

      async sentTestMail(){
        await this.mailerService.sendMail({
          to: "normansinto3@gmail.com",
          subject: 'Welcome to Suite Mate! Confirm your Email',
          template: '../../../mail/templates/welcome', // `.ejs` extension is appended automatically
          context: { // filling <%= %> brackets with content
            name: ``,
            confirmation_url: "dsd.com",
            default_password: "sdsdsd"
          },
        });
      }
}
