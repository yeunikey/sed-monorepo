import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Message } from './message.entity'
import { User } from 'src/users/models/user.entity'

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    participantOne: User

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    participantTwo: User

    @OneToMany(() => Message, message => message.chat)
    messages: Message[]

}
