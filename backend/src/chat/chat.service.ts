import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Chat } from './models/chat.entity';
import { Message } from './models/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/users/user.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chatRepo: Repository<Chat>,

        @InjectRepository(Message)
        private messageRepo: Repository<Message>,

        private userService: UserService
    ) { }

    async createChat(participantOneId: number, participantTwoId: number) {

        const existing = await this.chatRepo.findOne({
            where: [
                { participantOne: { id: participantOneId }, participantTwo: { id: participantTwoId } },
                { participantOne: { id: participantTwoId }, participantTwo: { id: participantOneId } },
            ],
        });

        if (existing) return existing;

        const participantOne = await this.userService.findById(participantOneId);
        const participantTwo = await this.userService.findById(participantTwoId);

        const body: DeepPartial<Chat> = {
            participantOne: {
                id: participantOne?.id
            },
            participantTwo: {
                id: participantTwo?.id
            }
        }
        const chat = this.chatRepo.create(body);
        return this.chatRepo.save(chat);
    }

    async getUserChats(userId: number) {
        return this.chatRepo.find({
            where: [
                { participantOne: { id: userId } },
                { participantTwo: { id: userId } },
            ],
            relations: ['messages', 'participantOne', 'participantTwo'],
        });
    }

    async sendMessage(chatId: number, senderId: number, content: string) {
        const chat = await this.chatRepo.findOne({
            where: { id: chatId },
            relations: ['participantOne', 'participantTwo'],
        });
        if (!chat) return null;

        const message = this.messageRepo.create({
            chat,
            senderId,
            content,
        });

        return this.messageRepo.save(message);
    }

    async getMessages(chatId: number) {
        return this.messageRepo.find({
            where: { chat: { id: chatId } },
            order: { timestamp: 'ASC' },
            relations: ['chat'],
        });
    }
}
