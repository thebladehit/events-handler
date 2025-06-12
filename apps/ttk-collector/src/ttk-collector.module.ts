import { Module } from '@nestjs/common';
import { TtkCollectorService } from './ttk-collector.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RepositoriesModule } from '@app/common/repositories';
import { JetStreamReadModule } from '@app/common/jet-streams';
import { DurableName, STREAM_NAME, SubjectName } from '@app/common/types';
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
} from './metrics/constance/metrics-constance';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        NATS_URL: Joi.string().required(),
        BATCH_SIZE: Joi.number().required(),
      }),
    }),
    JetStreamReadModule.forRoot({
      streamName: STREAM_NAME,
      durableName: DurableName.TIKTOK,
      subject: SubjectName.TIKTOK,
    }),
    RepositoriesModule,
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    TtkCollectorService,
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
export class TtkCollectorModule {}
