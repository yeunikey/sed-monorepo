import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./models/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    providers: [
        UserService,
    ],
    controllers: [
        UserController
    ],

    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    exports: [
        UserService
    ]
})
export class UserModule { }