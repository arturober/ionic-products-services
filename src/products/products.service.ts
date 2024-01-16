import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Comment } from '../entity/comment.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ImageService } from '../commons/image/image.service';
import { FirebaseService } from '../commons/firebase/firebase.service';
import { User } from '../entity/user.entity';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly imageService: ImageService,
    private readonly firebaseService: FirebaseService,
  ) {}

  getProducts(): Promise<Product[]> {
    return this.productRepo.find();
  }

  getProduct(id: number) {
    return this.productRepo.findOne({ where: {id} ,relations: ['creator']});
  }

  async insertProduct(prod: CreateProductDto) {
    prod.imageUrl = await this.imageService.saveImage(prod.imageUrl);
    const res = await this.productRepo.insert(prod);
    return this.productRepo.findOneBy({id: res.identifiers[0].id});
  }

  deleteProduct(id) {
    return this.productRepo.delete(id);
  }

  async updateRating(id: number, rating: UpdateRatingDto) {
    const prod = await this.productRepo.findOneBy({id});
    prod.rating = rating.rating;
    await this.productRepo.save(prod);
  }

  async getComments(idProd) {
    return await this.commentRepo.find({where: {product: idProd}, relations: ['user']});
  }

  async insertComment(commentDto: AddCommentDto) {
    const result = await this.commentRepo.insert(commentDto);
    const prod = await this.productRepo.findOne({ where: {id: commentDto.product}, loadRelationIds: true});
    const user = await this.userRepo.findOneBy({id: prod.creator.id});
    if (user.firebaseToken) {
      await this.firebaseService.sendMessage(user.firebaseToken, `New comment (${prod.description})`, commentDto.text, {prodId: '' + prod.id});
    }
    return await this.commentRepo.findOne({where: {id: +result.identifiers[0].id}, relations: ['user']});
  }
}
