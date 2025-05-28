import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.mail.ru',
                port: 465,
                secure: false, // Для портов 465 используйте secure: true
                auth: {
                    user: 'support@unilabs.studio',
                    pass: 'TEUdNkLjVYvsxk1RBVtJ', // Пароль приложения
                },
            },
            defaults: {
                from: '"No Reply" <support@unilabs.studio>'
            },
            template: {
                dir: __dirname + '/templates',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
