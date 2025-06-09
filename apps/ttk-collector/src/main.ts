import { NestFactory } from '@nestjs/core';
import { TtkCollectorModule } from './ttk-collector.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TtkCollectorModule);
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  await app.listen(configService.get('PORT'));
}
bootstrap();
