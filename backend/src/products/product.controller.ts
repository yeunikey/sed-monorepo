import { Body, Controller, Get, HttpStatus, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/auth/auth.guard";
import { UserService } from "src/users/user.service";
import { ImageService } from "src/image/image.service";
import { AuthRequest } from "src/types";
import { CategoryService } from "src/category/controller.service";
import { DeepPartial } from "typeorm";
import { Product } from "./entities/product.entity";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";

@Controller('products')
export class ProductController {

    constructor(
        private productService: ProductService,
        private userService: UserService,
        private imageService: ImageService,
        private categoryService: CategoryService
    ) { }

    @Get()
    async all() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.productService.all()
        };
    }

    @Get('/user/:user_id')
    async findByUser(@Param() params: { user_id: number }) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.productService.findByUser(params.user_id)
        }
    }

    @Get('/id/:product_id')
    async findById(@Param() params: { product_id: string }) {

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!uuidRegex.test(params.product_id)) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Неккоректный UUID"
            };
        }

        return {
            statusCode: HttpStatus.OK,
            data: await this.productService.findById(params.product_id)
        }
    }

    @Get('/delete/:product_id')
    @UseGuards(AuthGuard)
    async delete(@Param() params: { product_id: string }, @Req() { user: { id } }: AuthRequest) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Пользователь не найден"
            }
        }

        const product = await this.productService.findById(params.product_id);

        if (!product) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Товар не найден"
            }
        }

        if (product.user.id !== user.id) {
            return {
                statusCode: HttpStatus.FORBIDDEN,
                message: "Вы не можете редактировать этот товар"
            };
        }

        if (product.banner) {
            await this.imageService.delete(product.banner);
        }

        if (product.images.length != 0) {
            for (const image of product.images) {
                if (!uuidRegex.test(image)) {
                    continue;
                }
                const imageObj = await this.imageService.getImage(image);

                if (!imageObj) {
                    continue;
                }

                await this.imageService.delete(image);
            }
        }

        await this.productService.delete(product.id);

        return {
            statusCode: HttpStatus.OK,
        }
    }

    @Post('create')
    @UseInterceptors(AnyFilesInterceptor())
    @UseGuards(AuthGuard)
    async create(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: CreateProductDto,
        @Req() { user: { id } }: AuthRequest
    ) {

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: "Пользователь не найден"
            }
        }

        const category = await this.categoryService.findById(body.category);

        if (!category) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Категория не найдена"
            }
        }

        const subcategory = category.subcategories.find(c => c.id == body.subCategory);

        if (!subcategory) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Суб-категория не найдена"
            }
        }

        const variables: {
            name: string,
            value: string
        }[] = []

        if (body.variables) {
            for (const [key, value] of Object.entries(body.variables)) {
                const decodedKey = decodeURIComponent(key);
                const decodedValue = decodeURIComponent(value);

                variables.push({
                    name: decodedKey,
                    value: decodedValue
                })
            }
        }

        const mainImageFile = files.find(file => file.fieldname === 'mainImage');
        const productImageFiles = files.filter(file => file.fieldname === 'productImages');

        let mainImageEntity: string | undefined = undefined;
        if (mainImageFile) {
            mainImageEntity = (await this.imageService.saveImage(mainImageFile)).id;
        }

        const imageEntities: string[] = [];
        for (const image of productImageFiles) {
            const saved = await this.imageService.saveImage(image);
            imageEntities.push(saved.id);
        }

        const product: DeepPartial<Product> = {
            user,
            category,
            subCategory: subcategory,
            title: body.title,
            description: body.description,
            price: body.price,
            variables: variables,
            banner: mainImageEntity,
            images: imageEntities,
            city: body.city,
            minCount: body.minCount,
            delivery: body.delivery
        };

        const savedProduct = await this.productService.save(product);

        return {
            statusCode: HttpStatus.OK,
            data: savedProduct
        };
    }

    @Post('update')
    @UseInterceptors(AnyFilesInterceptor())
    @UseGuards(AuthGuard)
    async update(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: UpdateProductDto,
        @Req() { user: { id } }: AuthRequest
    ) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: "Пользователь не найден"
            }
        }

        const product = await this.productService.findById(body.id);

        if (!product) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Товар не найден"
            }
        }

        const category = await this.categoryService.findById(body.category);

        if (!category) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Категория не найдена"
            }
        }

        const subcategory = category.subcategories.find(c => c.id == body.subCategory);

        if (!subcategory) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Суб-категория не найдена"
            }
        }

        const variables: {
            name: string,
            value: string
        }[] = []

        if (body.variables) {
            for (const [key, value] of Object.entries(body.variables)) {
                const decodedKey = decodeURIComponent(key);
                const decodedValue = decodeURIComponent(value);

                variables.push({
                    name: decodedKey,
                    value: decodedValue
                })
            }
        }

        const mainImageFile = files.find(file => file.fieldname === 'mainImage');
        const productImageFiles = files.filter(file => file.fieldname === 'productImages');

        let mainImageEntity: string | undefined = undefined;
        if (mainImageFile && !body.mainImageIds) {
            if (product.banner) {
                await this.imageService.delete(product.banner);
            }
            mainImageEntity = (await this.imageService.saveImage(mainImageFile)).id;
        } else {
            mainImageEntity = product.banner;
        }

        const productImageIds = body.productImageIds || []; // Если body.productImageIds не существует, используем пустой массив

        for (let i = 0; i < productImageFiles.length; i++) {
            // Проверяем, что индекс в пределах длины массива productImageIds
            if (productImageIds.length <= i) {
                const file = productImageFiles[i];
                const savedImage = await this.imageService.saveImage(file);
                productImageIds.push(savedImage.id);
                continue;
            }

            const id = productImageIds[i];

            if (id) {
                productImageIds.push(id);
                continue;
            }

            const file = productImageFiles[i];
            const savedImage = await this.imageService.saveImage(file);
            productImageIds.push(savedImage.id);
        }


        for (const item of product.images) {
            if (!productImageIds.includes(item)) {
                if (!uuidRegex.test(item)) {
                    continue;
                }
                const imageObj = await this.imageService.getImage(item);

                if (!imageObj) {
                    continue;
                }

                await this.imageService.delete(item);
            }
        }

        const productObj: DeepPartial<Product> = {
            id: body.id,
            user,
            category,
            subCategory: subcategory,
            title: body.title,
            description: body.description,
            price: body.price,
            variables: variables,
            banner: mainImageEntity,
            images: productImageIds,
            city: body.city,
            minCount: body.minCount,
            delivery: body.delivery
        };

        const savedProduct = await this.productService.save(productObj);

        return {
            statusCode: HttpStatus.OK,
            data: savedProduct
        };
    }

}