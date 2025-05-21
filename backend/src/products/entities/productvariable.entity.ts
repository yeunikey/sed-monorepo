import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity("produt_vars_categories")
export class ProductVariable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    value: string;

    @ManyToOne(() => Product, product => product.variables, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'productId' })
    product: Product;
}
