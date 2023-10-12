import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters';
import rawBodyMiddleware from './utils/rawBody.middleware';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from './pipes';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './base';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  const logger = new Logger('NestApplication');

  app.enableCors({
    origin: [
      '*',
      'https://tenant.mysuitemates.com',
      'http://localhost:3000',
      'https://suitmates-suit-owner.vercel.app',
    ],
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(rawBodyMiddleware());
  app.setGlobalPrefix('/api');
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
