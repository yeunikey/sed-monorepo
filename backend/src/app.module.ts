import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/models/user.entity';
import { ShopInfo } from './users/models/shopinfo.entity';
import { UserModule } from './users/user.module';
import { MailModule } from './mailer/mail.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [    

    UserModule,
    MailModule,
    AuthModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '34.89.141.175',
      port: 9909,
      username: 'yeunikey',
      password: 'Yerassyl0107',
      database: 'sed',
      entities: [User, ShopInfo],
      synchronize: true,
      // logging: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
