import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Product } from "src/products/entities/product.entity";
import { Review } from "src/products/entities/review";
import { ShopInfo } from "./shopinfo.entity";

@Entity("users")
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({})
  password: string;

  @Column({ default: 0.0, type: 'float' })
  rating: number;

  @Column({ default: "Не указано" })
  city: string;

  @OneToOne(() => ShopInfo, (shopinfo) => shopinfo.user, { cascade: true, eager: true })
  shopinfo: ShopInfo;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Product, product => product.user)
  products: Product[];

  @ManyToMany(() => Product, { eager: false }) // не грузить по умолчанию
  @JoinTable()
  savedProducts: Product[];

  @OneToMany(() => Review, review => review.reviewer)
  reviewsLeft: Review[];

  @OneToMany(() => Review, review => review.seller)
  reviewsReceived: Review[];

}
