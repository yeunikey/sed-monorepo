import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./category.entity";
import { VariableCategory } from "./vars.entity";
import { Product } from "src/products/entities/product.entity";

@Entity("sub_categories")
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;

  @OneToMany(() => VariableCategory, (variable) => variable.sub_category, { cascade: true, eager: true })
  vars: VariableCategory[];

  @OneToMany(() => Product, product => product.subCategory)
  products: Product[];
}
