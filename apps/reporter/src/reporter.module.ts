import { Module } from '@nestjs/common';
import { ReporterController } from './reporter.controller';
import { ReporterService } from './reporter.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RepositoriesModule } from '@app/common/repositories';
import {
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { EXECUTION_LATENCY } from './metrics/constance/metrics-name';
import { MetricsService } from './metrics/metrics.service';
import { SharedProbeModule } from '@app/common/probe';
import { TerminusModule } from '@nestjs/terminus';
import { ReadinessController } from './readiness.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    RepositoriesModule,
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
    SharedProbeModule.forRoot({ usePrisma: true }),
    TerminusModule,
  ],
  controllers: [ReporterController, ReadinessController],
  providers: [
    ReporterService,
    MetricsService,
    makeHistogramProvider({
      name: EXECUTION_LATENCY,
      help: 'Execution time of a reporter service',
      labelNames: ['category'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
    }),
  ],
})
export class ReporterModule {}
