import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appPort = configService.getOrThrow<number>('APP_PORT', { infer: true });

  app.enableVersioning();
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const uploadDir = path.join(process.cwd(), 'uploads', 'compress');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('FCR API Documents')
      .setDescription('')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(appPort);
  logger.log(`Application start in http://localhost:${appPort}/api/documents`);
  logger.log(`Application start in http://localhost:${appPort}`);
  logger.log(`Application listening on PORT:${appPort}`);
  logger.log(`Current Timezone : ${new Date()}`);
}
void bootstrap();
