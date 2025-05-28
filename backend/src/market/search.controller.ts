import { Controller, Get, Query } from "@nestjs/common";
import { SearchDto } from "src/products/dto/product.dto";
import { ProductService } from "src/products/product.service";

@Controller('search')
export class SearchController {

    constructor(
        private productService: ProductService
    ) { }

    @Get()
    async search(@Query() query: SearchDto) {
        return this.productService.searchProducts(query);
    }


}