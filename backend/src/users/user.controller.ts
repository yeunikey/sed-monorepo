import { Body, Controller, Get, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthRequest } from "src/types";
import { SaveProductDto, UserUpdateDto } from "./dto/user.dto";
import { ImageService } from "src/image/image.service";
import { ProductService } from "src/products/product.service";

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
        private imageService: ImageService,
        private productService: ProductService
    ) { }

    @Get('get/:id')
    async get(@Param() params: { id: number }) {

        const user = await this.userService.findById(params.id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Такой пользователь не найден"
            };
        }

        return {
            statusCode: 200,
            data: {
                ...user,
                password: undefined
            }
        }
    }

    @Post('delete')
    @UseGuards(AuthGuard)
    async delete(@Req() req: AuthRequest) {

        const user = await this.userService.findById(req.user.id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Пользователь не найден"
            };
        }

        await this.userService.delete(user);

        return {
            statusCode: 200
        }
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Req() req: AuthRequest, @Body() body: UserUpdateDto) {
        const user = await this.userService.findByIdWithSavedProducts(req.user.id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Пользователь не найден"
            };
        }

        if (body.name) {
            user.name = body.name;
        }

        if (body.surname) {
            user.surname = body.surname;
        }

        if (body.phone) {
            user.phone = body.phone;
        }

        if (body.city) {
            user.city = body.city;
        }

        if (body.image) {
            if (user.image) {
                await this.imageService.delete(user.image);
            }
            user.image = body.image;
        }

        if (body.shopinfo) {
            if (body.shopinfo.name) {
                user.shopinfo.name = body.shopinfo.name;
            }
            if (body.shopinfo.address) {
                user.shopinfo.address = body.shopinfo.address;
            }
        }

        const saved = await this.userService.save(user);

        return {
            statusCode: 200,
            message: 'Профиль обновлён',
            data: {
                ...saved,
                password: undefined
            }
        };
    }

    @Post('is-saved-product')
    @UseGuards(AuthGuard)
    async isSaved(@Req() req: AuthRequest, @Body() body: SaveProductDto) {
        const user = await this.userService.findByIdWithSavedProducts(req.user.id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Пользователь не найден"
            };
        }

        return {
            statusCode: HttpStatus.OK,
            data: {
                saved: user.savedProducts.find(p => p.id == body.productId) ? true : false
            }
        }
    }

    @Post('save-product')
    @UseGuards(AuthGuard)
    async saveProduct(@Req() req: AuthRequest, @Body() body: SaveProductDto) {
        const user = await this.userService.findByIdWithSavedProducts(req.user.id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Пользователь не найден"
            };
        }

        if (user.savedProducts.find(p => p.id == body.productId)) {
            return {
                statusCode: 200,
            }
        }

        const product = await this.productService.findById(body.productId);

        if (!product) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Такого продукта не существует"
            }
        }

        user.savedProducts.push(product);
        await this.userService.save(user);

        return {
            statusCode: HttpStatus.OK,
        }
    }

    @Post('remove-saved-product')
    @UseGuards(AuthGuard)
    async removeProduct(@Req() req: AuthRequest, @Body() body: SaveProductDto) {
        const user = await this.userService.findByIdWithSavedProducts(req.user.id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Пользователь не найден"
            };
        }

        if (!user.savedProducts.find(p => p.id == body.productId)) {
            return {
                statusCode: 200,
            }
        }

        user.savedProducts = user.savedProducts.filter(s => body.productId != s.id);
        await this.userService.save(user);

        return {
            statusCode: HttpStatus.OK,
        }
    }

    @Get('saved-products')
    @UseGuards(AuthGuard)
    async savedProducts(@Req() req: AuthRequest) {
        const user = await this.userService.findByIdWithSavedProducts(req.user.id);

        if (!user) {
            return {
                statusCode: 400,
                message: "Пользователь не найден"
            };
        }

        return {
            statusCode: HttpStatus.OK,
            data: user.savedProducts
        }
    }


}