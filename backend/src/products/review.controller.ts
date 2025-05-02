import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { UserService } from "src/users/user.service";
import { ProductService } from "./product.service";
import { CreateReviewDto } from "./dto/review.dto";
import { AuthRequest } from "src/types";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('reviews')
export class ReviewController {

    constructor(
        private reviewService: ReviewService,
        private userService: UserService,
        private productService: ProductService
    ) { }

    @Get('get')
    @UseGuards(AuthGuard)
    async find(
        @Query('product_id') product_id: string, @Req() { user: { id } }: AuthRequest
    ) {

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: "Не удалось авторизоваться"
            }
        }

        const review = await this.reviewService.findByProductAndUser(product_id, user.id);

        if (!review) {
            return {
                statusCode: HttpStatus.NOT_FOUND
            }
        }

        return {
            statusCode: HttpStatus.OK,
            data: review
        };
    }

    @Get('product/:productId')
    async findByProduct(
        @Param('productId') productId: string,
    ) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.reviewService.findByProduct(productId)
        };
    }

    @Get('seller/:sellerId')
    async findBySeller(
        @Param('sellerId') sellerId: number,
    ) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.reviewService.findBySeller(sellerId)
        };
    }

    @Post('create')
    @UseGuards(AuthGuard)
    async create(
        @Body() body: CreateReviewDto, @Req() { user: { id } }: AuthRequest
    ) {

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: "Не удалось авторизоваться"
            }
        }

        return {
            statusCode: 200,
            data: await this.reviewService.save(body)
        }
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(
        @Body() body: CreateReviewDto, @Req() { user: { id } }: AuthRequest
    ) {

        const user = await this.userService.findById(id);

        if (!user) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: "Не удалось авторизоваться"
            }
        }

        const review = await this.reviewService.findByProductAndUser(body.product.id, body.reviewer.id);

        if (!review) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Не удалось найти оценку"
            }
        }

        review.stars = body.stars;

        return {
            statusCode: 200,
            data: await this.reviewService.save(review)
        }
    }

    @Delete('delete/:id')
    async deleteReview(@Param('id') id: number) {

        await this.reviewService.delete(id);

        return {
            statusCode: HttpStatus.OK
        };
    }

}