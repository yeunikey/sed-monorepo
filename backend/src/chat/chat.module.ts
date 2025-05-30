import { Chat } from "./models/chat.entity";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ImageModule } from "src/image/image.module";
import { Message } from "./models/message.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/users/user.module";

@Module({
    providers: [
        ChatService, ChatGateway
    ],
    controllers: [
        ChatController,
    ],

    imports: [
        TypeOrmModule.forFeature([Message, Chat]),
        UserModule,
        ImageModule
    ],
    exports: [
        ChatService
    ]
})
export class ChatModule { }