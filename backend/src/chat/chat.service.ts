import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Chat } from './models/chat.entity';
import { Message } from './models/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/users/user.service';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chatRepo: Repository<Chat>,

        @InjectRepository(Message)
        private messageRepo: Repository<Message>,

        private userService: UserService,
        private imageService: ImageService,

    ) { }

    async sendTextMessage(chatId: number, senderId: number, content: string) {
        const chat = await this.chatRepo.findOneBy({ id: chatId });
        if (!chat) return null;

        const message = this.messageRepo.create({
            chat,
            senderId,
            content,
            type: 'text',
        });

        return this.messageRepo.save(message);
    }

    async sendImageMessage(chatId: number, senderId: number, file: Express.Multer.File) {
        const chat = await this.chatRepo.findOneBy({ id: chatId });
        if (!chat) return null;

        const image = await this.imageService.saveImage(file);
        const content = `/images/${image.id}`; // ссылка на изображение

        const message = this.messageRepo.create({
            chat,
            senderId,
            content,
            type: 'image',
        });

        return this.messageRepo.save(message);
    }

    async findOrCreateChat(userId1: number, userId2: number): Promise<Chat | null> {
        let chat = await this.chatRepo.findOne({
            where: [
                { participantOne: { id: userId1 }, participantTwo: { id: userId2 } },
                { participantOne: { id: userId2 }, participantTwo: { id: userId1 } },
            ],
            relations: ['participantOne', 'participantTwo'],
        });

        if (!chat) {
            chat = this.chatRepo.create({
                participantOne: { id: userId1 },
                participantTwo: { id: userId2 },
            });
            chat = await this.chatRepo.save(chat, {
                transaction: true
            });

            chat = await this.chatRepo.findOne({
                where: { id: chat.id },
                relations: ['participantOne', 'participantTwo'],
            });
        }

        return chat;
    }


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

    async sendMessage(chatId: number, senderId: number, content: string, type: "image" | "text") {
        const chat = await this.chatRepo.findOne({
            where: { id: chatId },
            relations: ['participantOne', 'participantTwo'],
        });
        if (!chat) return null;

        const message = this.messageRepo.create({
            chat,
            senderId,
            content,
            type,
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
