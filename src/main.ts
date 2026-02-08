import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    //filtra tutti i dati non necessari ma inviati ugualmente
    //magari per tentare una injection
    whitelist: true
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
