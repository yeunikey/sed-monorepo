import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/models/user.entity';

@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(user: User, code: number): Promise<void> {

        try {
            await this.mailerService.sendMail({
                to: user.email,
                from: "support@unilabs.studio",
                subject: 'Подтверждение аккаунта',
                template: 'index',
                context: {
                    userName: user.name,
                    code: code
                },
            });

            console.log('Email sent successfully to ' + user.email);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
