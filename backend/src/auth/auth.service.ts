/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, ConfirmDto, LoginDto } from './dto/auth.dto';
import { MailService } from 'src/mailer/mail.service';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/models/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private mailService: MailService
    ) { }

    private readonly codeMap = new Map<string, { code: number; user: User; timeout: NodeJS.Timeout }>();

    generateCode() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    async register({ user }: RegisterDto) {

        const contains = await this.userService.findByEmail(user.email);

        if (contains) {
            return {
                statusCode: 400,
                message: "Такой юзер уже существует"
            };
        }

        const code = this.generateCode();
        const timeout = setTimeout(() => {
            this.codeMap.delete(user.email);
        }, 3 * 60 * 1000); // 3 минуты

        this.codeMap.set(user.email, { code, user, timeout });

        await this.mailService.sendEmail(user, code)

        return {
            statusCode: 200,
        };
    }

    async confirm({ code, email }: ConfirmDto) {

        const contains = await this.userService.findByEmail(email);

        if (contains) {
            return {
                statusCode: 400,
                message: "Такой юзер уже существует"
            };
        }

        const codeRequest = this.codeMap.get(email); 

        if (!codeRequest) {
            return {
                statusCode: 400,
                message: "Нет заявки с кодом"
            };
        }
        
        if (codeRequest.code != code) {
            return {
                statusCode: 400,
                message: "Неправильный код"
            };
        }

        const password = await bcrypt.hash(codeRequest.user.password, 10);
        const user = await this.userService.save({
            ...codeRequest.user,
            password: password
        });

        this.codeMap.delete(email);

        const payload = {
            id: user.id,
        };

        return {
            statusCode: 200,
            data: {
                token: await this.jwtService.signAsync(payload),
                user: user
            }
        };
    }

    async login({ email, password }: LoginDto) {

        const user = await this.userService.findByEmail(email);

        if (!user) {
            return {
                statusCode: 400,
                message: "Такого юзера не существует"
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {
                statusCode: 400,
                message: "Неправильный пароль"
            };
        }

        const payload = {
            id: user.id,
        };

        return {
            statusCode: 200,
            data: {
                token: await this.jwtService.signAsync(payload),
                user: user
            }
        };
    }

}
