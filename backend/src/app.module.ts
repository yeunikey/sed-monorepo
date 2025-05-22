import { AuthModule } from './auth/auth.module';
import { Category } from './category/models/category.entity';
import { CategoryModule } from './category/category.module';
import { Image } from './image/entities/image.entity';
import { ImageModule } from './image/image.module';
import { MailModule } from './mailer/mail.module';
import { MarketModule } from './market/market.module';
import { Module } from '@nestjs/common';
import { Product } from './products/entities/product.entity';
import { ProductModule } from './products/product.module';
import { ProductVariable } from './products/entities/productvariable.entity';
import { Review } from './products/entities/review';
import { ShopInfo } from './users/models/shopinfo.entity';
import { SubCategory } from './category/models/subcategory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/models/user.entity';
import { UserModule } from './users/user.module';
import { VariableCategory } from './category/models/vars.entity';

@Module({
  imports: [

    UserModule,
    MailModule,
    AuthModule,
    CategoryModule,
    ImageModule,
    ProductModule,
    MarketModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '34.141.54.61',
      port: 1111,
      username: 'admin',
      password: 'Astana2024!',
      database: 'sed',
      entities: [User, ShopInfo, Category, SubCategory, VariableCategory, Image, Product, ProductVariable, Review],
      synchronize: true,
      // logging: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
