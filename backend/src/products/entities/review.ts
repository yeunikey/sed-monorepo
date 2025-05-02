import { User } from 'src/users/models/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    stars: number;

    @ManyToOne(() => User, user => user.reviewsLeft, { eager: true })
    reviewer: User;

    @ManyToOne(() => User, user => user.reviewsReceived, { eager: true })
    seller: User;

    @ManyToOne(() => Product, product => product.reviews, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn()
    product: Product;
}