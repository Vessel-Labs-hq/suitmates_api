import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserWelcome(email: any, password: string): Promise<void>;
}
