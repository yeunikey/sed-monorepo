import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { ShopInfo } from "./shopinfo.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

//   @OneToOne(() => Image, (image) => image.user, { cascade: true })
//   @JoinColumn()
//   image: Image;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => ShopInfo, (shopInfo) => shopInfo.user, { cascade: true })
  @JoinColumn()
  shopinfo: ShopInfo;

}
