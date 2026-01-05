import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DataSource } from 'typeorm';
import { createSuperAdmin } from './seed/superAdmin.seed';
import { ConfigService } from '@nestjs/config';

// ... your imports stay the same ...

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: "*",
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: "*",
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // MINIMAL CHANGE HERE:
  await app.init();
  return app.getHttpAdapter().getInstance();
}

// Export for Vercel
export default bootstrap();