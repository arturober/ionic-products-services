import { Get, Controller, Post, Body, ValidationPipe, Request, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return '{"hello": "Hello world!"}';
  }
}
