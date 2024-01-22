import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as admin from 'firebase-admin';
import { useContainer } from 'class-validator';

// tslint:disable-next-line:no-var-requires
const serviceAccount = require('../firebase/firebase_key.json');

async function bootstrap() {
  const basePath = process.env.BASE_PATH || '';
  const app = await NestFactory.create(AppModule, {cors: true});
  app.use(
    '/' + basePath + 'img',
    express.static(__dirname + '/../img'),
  );
  app.use(express.json({limit: '10mb'}));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix(
    basePath ? basePath.slice(0, -1) : '',
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();
