import { NestFactory } from '@nestjs/core';
import { FbCollectorModule } from './fb-collector.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(FbCollectorModule);
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  app.useLogger(app.get(Logger));
  await app.listen(configService.get('PORT'));
}

bootstrap();
