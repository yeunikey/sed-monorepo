import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { SubCategory } from "./subcategory.entity";

@Entity("vars_categories")
export class VariableCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => SubCategory, (sub_category) => sub_category.vars)
  sub_category: SubCategory;
}
