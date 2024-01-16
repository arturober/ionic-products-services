import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CommonsModule } from '../commons/commons.module';
import { Product } from '../entity/product.entity';
import { Comment } from '../entity/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';

@Module({
  imports: [CommonsModule, TypeOrmModule.forFeature([Product, Comment, User])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
