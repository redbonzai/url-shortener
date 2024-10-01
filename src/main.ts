import { NestFactory } from '@nestjs/core';
import { UrlModule } from './url.module';

async function bootstrap() {
  const app = await NestFactory.create(UrlModule);

  app.enableCors({
    origin: 'http://localhost:4200', // Allow only your Angular frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific methods
    credentials: true, // Allow cookies if needed
  });

  await app.listen(3250);
}
bootstrap();
