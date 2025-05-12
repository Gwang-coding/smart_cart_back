import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.0.7:3000',
      'https://quickcheckout.netlify.app/',
      'http://192.168.0.7',
      'http://172.16.98.150:3000',
      'http://172.30.1.82:3000',
      'http://172.16.100.137:3000',
      ' http://172.16.102.10:3000',
    ], // Next.js 도메인만 허용
  });

  await app.listen(3001);
}
bootstrap();
