import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DataSource } from 'typeorm';
import { createSuperAdmin } from './seed/superAdmin.seed';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const configService = app.get(ConfigService);
  console.log('Database Configuration:');
  console.log('  DB_HOST:', configService.get('DB_HOST'));
  console.log('NODE_ENV = ', process.env.NODE_ENV);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
  });
  const dataSource = app.get(DataSource);
  const config = new DocumentBuilder()
  .setTitle('CMS API')
  .setDescription('Legal Case Management System API')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    },
    'access-token', // name (important)
  )
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
