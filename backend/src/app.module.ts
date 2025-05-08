import { AuthModule } from './auth/auth.module';
import { DataSet } from './dataset/models/dataset';
import { DatasetModule } from './dataset/dataset.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/models/user.entity';
import { UserModule } from './users/user.module';

@Module({
  imports: [

    UserModule,
    AuthModule,
    DatasetModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '34.89.141.175',
      port: 1591,
      username: 'yeunikey',
      password: 'Aitusa2025!',
      database: 'ai',
      entities: [User, DataSet],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
