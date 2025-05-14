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

  const isDevelopment = process.env.NODE_ENV !== 'production';

  app.enableCors({
    origin: isDevelopment
      ? [
          'http://localhost:3000',
          'http://192.168.0.7:3000',
          'http://192.168.0.7',
          'http://172.16.98.150:3000',
          'http://172.30.1.82:3000',
          'http://172.16.100.137:3000',
          'http://172.16.102.10:3000',
        ]
      : [
          'https://quickcheckout.netlify.app',
          // 프론트엔드 배포 URL 추가
        ],
    credentials: true, // 필요한 경우 쿠키/인증 관련 CORS 설정
  });

  const port = process.env.PORT || 8080; // 기본 포트를 8080으로 변경
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
