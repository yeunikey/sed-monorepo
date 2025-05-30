/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Get, Body, Param, HttpStatus, Req, UseGuards, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/types';
import { UserService } from 'src/users/user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('chats')
@UseGuards(AuthGuard)
export class ChatController {

    constructor(
        private chatService: ChatService,
        private userService: UserService
    ) { }

    @Post('send-image')
    @UseInterceptors(FileInterceptor('file'))
    async sendImage(
        @Req() req,
        @Body() body: { chatId: number },
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('Файл не загружен');
        }

        const message = await this.chatService.sendImageMessage(body.chatId, req.user.id, file);
        if (!message) {
            throw new BadRequestException('Чат не найден');
        }

        return {
            statusCode: 200,
            data: message,
        };
    }

    @Post('create-or-get')
    async createOrGetChat(@Req() req: AuthRequest, @Body() body: { receiverId: number }) {

        if (req.user.id == body.receiverId) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Вы не можете создать чат с сам собой"
            }
        }

        const chat = await this.chatService.findOrCreateChat(req.user.id, body.receiverId);
        return {
            statusCode: HttpStatus.OK,
            data: chat
        };
    }


    @Get('search')
    async searchByFullName(@Query('query') query: string) {
        const users = await this.userService.searchByFullName(query);
        return { statusCode: HttpStatus.OK, data: users };
    }

    @Post('create')
    async create(@Req() req: AuthRequest, @Body() body: { receiverId: number }) {
        const chat = await this.chatService.createChat(req.user.id, body.receiverId);
        return { statusCode: HttpStatus.OK, data: chat };
    }

    @Get('my')
    async myChats(@Req() req: AuthRequest) {
        const chats = await this.chatService.getUserChats(req.user.id);
        return { statusCode: HttpStatus.OK, data: chats };
    }

    @Post('send-message')
    async sendMessage(@Req() req: AuthRequest, @Body() body: { chatId: number; content: string, type: "image" | "text" }) {
        const message = await this.chatService.sendMessage(body.chatId, req.user.id, body.content, body.type);
        if (!message) {
            return { statusCode: HttpStatus.BAD_REQUEST, message: 'Чат не найден' };
        }
        return { statusCode: HttpStatus.OK, data: message };
    }

    @Get(':chatId/messages')
    async getMessages(@Param('chatId') chatId: number) {
        const messages = await this.chatService.getMessages(chatId);
        return { statusCode: HttpStatus.OK, data: messages };
    }

}