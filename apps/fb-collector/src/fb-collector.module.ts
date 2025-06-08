import { Module } from '@nestjs/common';
import { FbCollectorService } from './fb-collector.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  DurableName,
  JetStreamReadModule,
  STREAM_NAME,
  SubjectName,
} from '@app/common';
import { RepositoriesModule } from '@app/common/repositories';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        NATS_URL: Joi.string().required(),
      }),
    }),
    JetStreamReadModule.forRoot({
      streamName: STREAM_NAME,
      durableName: DurableName.FACEBOOK,
      subject: SubjectName.FACEBOOK,
    }),
    RepositoriesModule,
  ],
  providers: [FbCollectorService],
})
export class FbCollectorModule {}
