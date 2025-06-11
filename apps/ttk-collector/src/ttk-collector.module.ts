import { Module } from '@nestjs/common';
import { TtkCollectorService } from './ttk-collector.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RepositoriesModule } from '@app/common/repositories';
import { JetStreamReadModule } from '@app/common/jet-streams';
import { DurableName, STREAM_NAME, SubjectName } from '@app/common/types';

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
  ],
  providers: [TtkCollectorService],
})
export class TtkCollectorModule {}
