import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { queryParser } from './common/middleware/qs.middleware';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(queryParser);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: ['http://127.0.0.1:5500'], // or '*' to allow all
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log('Server is running on port', port);
  });
}
bootstrap();
