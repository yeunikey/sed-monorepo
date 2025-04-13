import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, ConfirmDto, LoginDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/users/user.service';
import { AuthRequest } from 'src/types';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    @UseGuards(AuthGuard)
    @Get('profile')
    async profile(@Request() req: AuthRequest) {
        const user = await this.userService.findById(req.user.id);
        return {
            statusCode: 200,
            data: user
        };
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post('confirm')
    async confirm(@Body() body: ConfirmDto) {
        return this.authService.confirm(body);
    }

    @Post('login')
    async login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

}
