import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  Body,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  Get,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() userDto: RegisterUserDto) {
    try {
      const user = await this.authService.registerUser(userDto);
      return { email: user.email };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() userDto: LoginUserDto) {
    try {
      return await this.authService.login(userDto);
    } catch (e) {
      throw new UnauthorizedException('Email or password incorrect');
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: any) {
    const result = {user: await this.authService.getProfile(req.user.id)};
    const basePath = process.env.BASE_PATH + '/' || '';

    const baseUrl = `${req.protocol}://${req.headers.host}/${basePath}`;
    result.user.avatar = basePath + result.user.avatar;
    return result;
  }

  @Get('validate')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  validate() {
    // Valida el token
  }
}
