import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./entities/review";
import { DeepPartial, Repository } from "typeorm";
import { ProductService } from "./product.service";

@Injectable()
export class ReviewService {

    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        @Inject(forwardRef(() => ProductService))
        private productService: ProductService,
    ) { }

    async findByProductAndUser(product_id: string, user_id: number) {
        const review = await this.reviewRepository.findOne({
            where: {
                product: {
                    id: product_id
                },
                reviewer: {
                    id: user_id
                }
            },
            relations: ['reviewer', 'seller'],
        });
        return review
    }

    async findByProduct(product_id: string) {
        const reviews = await this.reviewRepository.find({
            where: { product: { id: product_id } },
            relations: ['reviewer', 'seller'],
        });

        return reviews;
    }

    async findBySeller(seller_id: number) {
        const reviews = await this.reviewRepository.find({
            where: { seller: { id: seller_id } },
            relations: ['reviewer', 'seller'],
        });

        return reviews;
    }

    async delete(id: number) {
        await this.reviewRepository.delete(id);
    }

    async save(review: DeepPartial<Review>) {
        const savedReview = await this.reviewRepository.save(review);

        if (savedReview.product) {
            await this.productService.updateProductAndSellerRating(savedReview.product.id);
        }
    }


}