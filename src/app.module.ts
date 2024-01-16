import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product } from './entity/product.entity';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CommonsModule } from './commons/commons.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_SERVER_HOST || 'localhost',
      port: parseInt(process.env.DB_SERVER_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'products_ionic',
      entities: [__dirname + '/entity/*.entity{.ts,.js}'],
      //synchronize: true,
    }),
    TypeOrmModule.forFeature([Product]),
    ProductsModule,
    AuthModule,
    CommonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
