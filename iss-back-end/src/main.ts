import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:5173',
    ],
    credentials: true,
  });

  app.use(cookieParser());

  const uploadsPath = join(process.cwd(), 'uploads');

  console.log('STATIC UPLOADS PATH:', uploadsPath);

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableShutdownHooks();

  await app.listen(3000);

  console.log('Backend running on http://localhost:3000');
}

bootstrap();