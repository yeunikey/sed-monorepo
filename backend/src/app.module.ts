import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/models/user.entity';
import { ShopInfo } from './users/models/shopinfo.entity';
import { UserModule } from './users/user.module';
import { MailModule } from './mailer/mail.module';
import { AuthModule } from './auth/auth.module';
import { Category } from './category/models/category.entity';
import { SubCategory } from './category/models/subcategory.entity';
import { VariableCategory } from './category/models/vars.entity';
import { CategoryModule } from './category/category.module';
import { ImageModule } from './image/image.module';
import { Image } from './image/entities/image.entity';
import { Product } from './products/entities/product.entity';
import { ProductVariable } from './products/entities/productvariable.entity';
import { ProductModule } from './products/product.module';
import { MarketModule } from './market/market.module';
import { Review } from './products/entities/review';

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
      host: '34.89.141.175',
      port: 9909,
      username: 'yeunikey',
      password: 'Yerassyl0107',
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
