import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/users/user.service';
import { AuthRequest } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    @UseGuards(AuthGuard)
    @Get('profile')
    async profile(@Request() req: AuthRequest) {
        const user = await this.userService.findById(req.user.id);
        return {
            statusCode: 200,
            data: {
                ...user,
                password: undefined
            },
        };
    }

    @Post('login')
    async login(@Body() body: LoginDto) {

        const user = await this.userService.findByLogin(body.login);

        if (!user) {
            return {
                statusCode: 400,
                message: "Такого юзера не существует"
            };
        }

        const isMatch = await bcrypt.compare(body.password, user.password);

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
