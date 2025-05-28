import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { DeepPartial, Repository } from "typeorm";
import { SearchDto } from "./dto/product.dto";
import { ReviewService } from "./review.service";
import { UserService } from "src/users/user.service";

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private reviewService: ReviewService,
        private userService: UserService
    ) { }

    async updateProductAndSellerRating(productId: string) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['reviews', 'user']
        });

        if (!product) {
            throw new Error("Product not found");
        }

        const reviews = product.reviews;
        const totalRating = reviews.reduce((sum, review) => sum + review.stars, 0);
        const productRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        product.rating = productRating;
        await this.productRepository.save(product);

        const seller = product.user;

        const sellerReviews = await this.reviewService.findBySeller(seller.id);

        const totalSellerRating = sellerReviews.reduce((sum, review) => sum + review.stars, 0);
        const sellerRating = sellerReviews.length > 0 ? totalSellerRating / sellerReviews.length : 0;

        seller.rating = sellerRating;

        await this.userService.save(seller);
    }

    async findByUser(user_id: number) {
        return await this.productRepository.find({
            where: {
                user: {
                    id: user_id
                }
            }
        })
    }

    async findById(product_id: string) {
        return await this.productRepository.findOneBy({
            id: product_id
        })
    }

    async save(product: DeepPartial<Product>) {
        return await this.productRepository.save(product);
    }

    async delete(id: string) {
        return await this.productRepository.delete(id);
    }

    async all() {
        return await this.productRepository.find();
    }

    async searchProducts(query: SearchDto): Promise<Product[]> {
        const qb = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.subCategory', 'subCategory');

        // if (query.text) {
        //     qb.andWhere('(LOWER(product.title) LIKE :text OR LOWER(product.description) LIKE :text)', {
        //         text: `%${query.text.toLowerCase()}%`,
        //     });
        // }

        if (query.text) {
            qb.andWhere('(LOWER(product.title) LIKE :text)', {
                text: `%${query.text.toLowerCase()}%`,
            });
        }

        if (query.categoryId) {
            qb.andWhere('category.id = :categoryId', { categoryId: query.categoryId });
        }

        if (query.subcategoryId) {
            qb.andWhere('subCategory.id = :subcategoryId', { subcategoryId: query.subcategoryId });
        }

        if (query.minPrice) {
            qb.andWhere('product.price >= :minPrice', { minPrice: query.minPrice });
        }

        if (query.maxPrice) {
            qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
        }

        if (query.city) {
            qb.andWhere('product.city = :city', { city: query.city });
        }

        // Сортировка
        switch (query.sort) {
            case 'price_asc':
                qb.orderBy('product.price', 'ASC');
                break;
            case 'price_desc':
                qb.orderBy('product.price', 'DESC');
                break;
            case 'newest':
                qb.orderBy('product.createdAt', 'DESC');
                break;
            case 'oldest':
                qb.orderBy('product.createdAt', 'ASC');
                break;
            default:
                qb.orderBy('product.createdAt', 'DESC'); // по умолчанию — новизна
        }

        return qb.getMany();
    }

}