import { Controller, Get, Param, Post, Body, ValidationPipe, Delete, Put, ParseIntPipe, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from '@nestjs/passport';
import { AddCommentDto } from './dto/add-comment.dto';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly prodService: ProductsService) {}

  @Get('')
  async getProducts() {
    const products = await this.prodService.getProducts();
    return {products};
  }

  @Get(':id')
  async getProduct(@Param('id') id) {
    const product = await this.prodService.getProduct(id);
    return {product};
  }

  @Post('')
  async postProduct(
    @Req() req: any,
    @Body(new ValidationPipe({ transform: true })) prodDto: CreateProductDto,
  ) {
    prodDto.creator = req.user.id;
    const prod = await this.prodService.insertProduct(prodDto);
    return {product: prod};
  }

  @Delete(':id')
  @HttpCode(204)
  async removeProduct(@Param('id') id) {
    await this.prodService.deleteProduct(id);
  }

  @Put(':id/rating')
  async updateRating(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) rating: UpdateRatingDto) {
    await this.prodService.updateRating(id, rating);
    return {rating: rating.rating};
  }

  @Get(':id/comments')
  async getComments(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {comments: await this.prodService.getComments(id)};
  }

  @Post(':id/comments')
  async addComment(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) comment: AddCommentDto,
  ) {
    comment.user = req.user.id;
    comment.product = id;
    return {comment: await this.prodService.insertComment(comment)};
  }
}
