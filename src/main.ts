import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Le validation pipe permet de valider les données envoyées par l'utilisateur
  //whitelist permet de supprimer les données qui ne sont pas dans le DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
  }));
  await app.listen(3000);
}
bootstrap();
