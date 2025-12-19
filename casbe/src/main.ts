import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DataSource } from 'typeorm';
import { createSuperAdmin } from './seed/superAdmin.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: "*",
  })
  const dataSource = app.get(DataSource);
  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);



  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
