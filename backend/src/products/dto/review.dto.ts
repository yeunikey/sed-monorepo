import { User } from "src/users/models/user.entity";
import { Product } from "../entities/product.entity";

export class CreateReviewDto {
    stars: number;
    reviewer: User;
    seller: User;
    product: Product;
}