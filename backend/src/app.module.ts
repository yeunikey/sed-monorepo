import { AuthModule } from './auth/auth.module';
import { Category } from './category/models/category.entity';
import { CategoryModule } from './category/category.module';
import { Chat } from './chat/models/chat.entity';
import { ChatModule } from './chat/chat.module';
import { Image } from './image/entities/image.entity';
import { ImageModule } from './image/image.module';
import { MailModule } from './mailer/mail.module';
import { MarketModule } from './market/market.module';
import { Message } from './chat/models/message.entity';
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
    ChatModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '85.202.195.185',
      port: 5432,
      username: 'sed',
      password: 'Astana2024!',
      database: 'sed',
      entities: [User, ShopInfo, Category, SubCategory, VariableCategory, Image, Product, ProductVariable, Review, Message, Chat],
      synchronize: true,
      // logging: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
