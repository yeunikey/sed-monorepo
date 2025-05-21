import { Module } from "@nestjs/common";
import { CategoryModule } from "src/category/category.module";
import { ProductModule } from "src/products/product.module";
import { SearchController } from "./search.controller";

@Module({
    imports: [
        ProductModule,
        CategoryModule
    ],
    controllers: [
        SearchController
    ],
    exports: [],
    providers: []
})
export class MarketModule { }