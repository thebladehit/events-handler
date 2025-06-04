import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(configService.get('PORT'));
}

bootstrap();

// app.connectMicroservice<MicroserviceOptions>({
//   transport: Transport.NATS,
//   options: {
//     servers: [],
//   },
// });