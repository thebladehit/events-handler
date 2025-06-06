import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { JetStreamWriterModule, STREAM_NAME, SubjectName } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        NATS_URL: Joi.string().required(),
      }),
    }),
    JetStreamWriterModule.forRoot({
      streamName: STREAM_NAME,
      subjects: [...Object.values(SubjectName)],
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
