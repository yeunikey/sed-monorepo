import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Chat } from './chat.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    senderId: number;

    @Column()
    content: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ default: 'text' })
    type: 'text' | 'image';

    @ManyToOne(() => Chat, chat => chat.messages, { onDelete: 'CASCADE' })
    chat: Chat;
}