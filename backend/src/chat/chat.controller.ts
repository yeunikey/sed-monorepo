import { Controller, Post, Get, Body, Param, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/types';

@Controller('chats')
@UseGuards(AuthGuard)
export class ChatController {

    constructor(private chatService: ChatService) { }

    

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
    async sendMessage(@Req() req: AuthRequest, @Body() body: { chatId: number; content: string }) {
        const message = await this.chatService.sendMessage(body.chatId, req.user.id, body.content);
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