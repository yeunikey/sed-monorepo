import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: '*', // Для dev-режима, можно ограничить
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(client: Socket, chatId: number) {
        client.join(`chat-${chatId}`);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        client: Socket,
        @MessageBody()
        data: { chatId: number; senderId: number; content: string },
    ) {
        const message = await this.chatService.sendMessage(data.chatId, data.senderId, data.content);
        if (message) {
            this.server.to(`chat-${data.chatId}`).emit('newMessage', message);
        }
    }

}
