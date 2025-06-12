import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { JetStreamWriterModule } from '@app/common/jet-streams';
import { STREAM_NAME } from '@app/common/types';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MetricsService } from './metrics/metrics.service';
import {
  ACCEPTED_EVENTS,
  FAILED_EVENTS,
  PROCESSED_EVENTS,
} from './metrics/constance/metrics-name';

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
    }),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    MetricsService,
    makeCounterProvider({
      name: ACCEPTED_EVENTS,
      help: 'Total number of accepted events',
    }),
    makeCounterProvider({
      name: PROCESSED_EVENTS,
      help: 'Total number of processed events',
    }),
    makeCounterProvider({
      name: FAILED_EVENTS,
      help: 'Total number of failed events',
    }),
  ],
})
export class GatewayModule {}
