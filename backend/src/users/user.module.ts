import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./models/user.entity";
import { ShopInfo } from "./models/shopinfo.entity";
import { UserController } from "./user.controller";

@Module({
    providers: [
        UserService,
    ],
    controllers: [
        UserController,
    ],
    
    imports: [TypeOrmModule.forFeature([User, ShopInfo])],
    exports: [
        UserService
    ]
})
export class UserModule {}