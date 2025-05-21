import { Module } from "@nestjs/common";
import { CategoryService } from "./controller.service";
import { CategoryController } from "./category.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./models/category.entity";
import { SubCategory } from "./models/subcategory.entity";
import { VariableCategory } from "./models/vars.entity";

@Module({
    exports: [
        CategoryService
    ],
    imports: [
        TypeOrmModule.forFeature([Category, SubCategory, VariableCategory])
    ],
    controllers: [
        CategoryController
    ],
    providers: [
        CategoryService
    ]
})
export class CategoryModule { }