import { forwardRef, Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductVariable } from "./entities/productvariable.entity";
import { UserModule } from "src/users/user.module";
import { ImageModule } from "src/image/image.module";
import { CategoryModule } from "src/category/category.module";
import { Review } from "./entities/review";
import { ReviewService } from "./review.service";
import { ReviewController } from "./review.controller";


@Module({
    controllers: [
        ProductController,
        ReviewController
    ],
    exports: [
        ProductService,
        ReviewService
    ],
    imports: [
        TypeOrmModule.forFeature([Product, ProductVariable, Review]),

        forwardRef(() => UserModule),
        ImageModule,
        CategoryModule,
    ],
    providers: [
        ProductService,
        ReviewService
    ]
})
export class ProductModule { }