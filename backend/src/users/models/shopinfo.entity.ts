import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class ShopInfo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToOne(() => User, (user) => user.shopinfo, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

}
