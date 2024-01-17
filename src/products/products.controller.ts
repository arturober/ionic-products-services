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
  async getProducts(@Req() req) {
    const products = await this.prodService.getProducts();
    const basePath = process.env.BASE_PATH || '';

    const baseUrl = `${req.protocol}://${req.headers.host}/${basePath}`;
    products.forEach(product => {
      product.imageUrl = baseUrl + product.imageUrl;
    });
    return {products};
  }

  @Get(':id')
  async getProduct(@Param('id') id, @Req() req) {
    const product = await this.prodService.getProduct(id);
    const basePath = process.env.BASE_PATH || '';

    const baseUrl = `${req.protocol}://${req.headers.host}/${basePath}`;
    product.imageUrl = baseUrl + product.imageUrl;
    return {product};
  }

  @Post('')
  async postProduct(
    @Req() req: any,
    @Body(new ValidationPipe({ transform: true })) prodDto: CreateProductDto,
  ) {
    prodDto.creator = req.user.id;
    const product = await this.prodService.insertProduct(prodDto);
    const basePath = process.env.BASE_PATH || '';

    const baseUrl = `${req.protocol}://${req.headers.host}/${basePath}`;
    product.imageUrl = baseUrl + product.imageUrl;
    return {product: product};
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
    @Req() req
  ) {
    const comments = await this.prodService.getComments(id);
    const basePath = process.env.BASE_PATH || '';
    const baseUrl = `${req.protocol}://${req.headers.host}/${basePath}`;
    comments.forEach(c => {
      c.user.avatar = baseUrl + c.user.avatar;
    });
    return { comments }; 
  }

  @Post(':id/comments')
  async addComment(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) comment: AddCommentDto,
  ) {
    comment.user = req.user.id;
    comment.product = id;
    const c = await this.prodService.insertComment(comment);

    const basePath = process.env.BASE_PATH || '';
    const baseUrl = `${req.protocol}://${req.headers.host}/${basePath}`;

    c.user.avatar = baseUrl + c.user.avatar;
    return { comment: c }; 
  }
}
