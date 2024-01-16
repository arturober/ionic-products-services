import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as admin from 'firebase-admin';
import { useContainer } from 'class-validator';

// tslint:disable-next-line:no-var-requires
const serviceAccount = require('../firebase/dwec-2017-1507729559860-firebase-adminsdk-pez2j-2c8c522f89');

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
    databaseURL: 'https://dwec-2017-1507729559860.firebaseio.com',
  });

  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();
