import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./models/user.entity";
import { ShopInfo } from "./models/shopinfo.entity";
import { UserController } from "./user.controller";
import { ImageModule } from "src/image/image.module";
import { ProductModule } from "src/products/product.module";

@Module({
    providers: [
        UserService,
    ],
    controllers: [
        UserController,
    ],

    imports: [
        TypeOrmModule.forFeature([User, ShopInfo]),
        ImageModule,
        forwardRef(() => ProductModule)
    ],
    exports: [
        UserService
    ]
})
export class UserModule { }