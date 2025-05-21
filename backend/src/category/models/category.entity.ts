import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SubCategory } from "./subcategory.entity";
import { Product } from "src/products/entities/product.entity";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SubCategory, (subcategory) => subcategory.category, { cascade: true, eager: true })
  subcategories: SubCategory[];

  @OneToMany(() => Product, (product) => product.subCategory)
  products: Product[];

}
