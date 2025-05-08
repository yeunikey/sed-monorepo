import { Body, Controller, Delete, Get, HttpStatus, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthGuard } from "src/auth/auth.guard";
import { UserService } from "./user.service";
import { AuthRequest } from "src/types";
import { RegisterDto } from "./dto/users.dto";
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    async all(@Req() { user: { id } }: AuthRequest) {

        const user = await this.userService.findById(id);

        if (!user || user.role != "ADMIN") {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'У вас нет прав'
            }
        }

        const admins = await this.userService.all();

        return {
            statusCode: 200,
            data: admins.filter(a => a.login != 'admin')
        }
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(@Req() { user: { id } }: AuthRequest, @Body() body: RegisterDto) {

        const user = await this.userService.findById(id);

        if (!user || user.role != "ADMIN") {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'У вас нет прав'
            }
        }

        const intern = await this.userService.findByLogin(body.login);

        if (intern) {
            return {
                statusCode: HttpStatus.FOUND,
                message: "Такой пользователь уже существует"
            }
        }

        return {
            statusCode: 200,
            data: await this.userService.save({
                login: body.login,
                password: await bcrypt.hash(body.password, 10),
                role: "USER"
            })
        }
    }

    @UseGuards(AuthGuard)
    @Delete()
    async delete(@Req() { user: { id: user_id } }: AuthRequest, @Query('id') id: number) {

        const user = await this.userService.findById(user_id);

        if (!user || user.role != "ADMIN") {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'У вас нет прав'
            }
        }

        await this.userService.delete(id)

        return {
            statusCode: 200,
        }
    }

}