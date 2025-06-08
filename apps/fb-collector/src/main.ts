import { NestFactory } from '@nestjs/core';
import { FbCollectorModule } from './fb-collector.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(FbCollectorModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}

bootstrap();
