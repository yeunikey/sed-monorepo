import { Category } from 'src/category/models/category.entity';
import { SubCategory } from 'src/category/models/subcategory.entity';
import { User } from 'src/users/models/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { ProductVariable } from './productvariable.entity';
import { Review } from './review';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Category, category => category.products, { eager: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @ManyToOne(() => SubCategory, subCategory => subCategory.products, { eager: true })
    @JoinColumn({ name: 'subCategoryId' })
    subCategory: SubCategory;

    @ManyToOne(() => User, user => user.products, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    title: string;

    @Column({ default: "Не указано" })
    city: string;

    @Column('text')
    description: string;

    @Column({ default: 0, type: 'float' })
    rating: number;

    @OneToMany(() => ProductVariable, variable => variable.product, { cascade: true, eager: true })
    variables: ProductVariable[];

    @Column({ nullable: true })
    banner: string;

    @Column({ default: 1 })
    minCount: number;

    @Column({ default: "Не указано" })
    delivery: string;

    @Column("text", { array: true, nullable: true })
    images: string[];

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Review, review => review.product)
    reviews: Review[];

}
