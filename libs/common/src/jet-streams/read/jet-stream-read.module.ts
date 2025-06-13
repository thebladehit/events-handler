import { DynamicModule, Module } from '@nestjs/common';
import { JetStreamReaderService } from '@app/common/jet-streams';
import { JetStreamReaderServiceImpl } from '@app/common/jet-streams/read/jet-stream-readerImpl.service';
import { NATS_CONNECTION, NatsModule } from '@app/common/jet-streams/nats';
import { NatsConnection } from 'nats';
import { LoggerModule } from '@app/common/logger';
import { Logger } from 'nestjs-pino';

@Module({})
export class JetStreamReadModule {
  static forRoot(options: {
    streamName: string;
    durableName: string;
    subject: string;
  }): DynamicModule {
    return {
      module: JetStreamReadModule,
      imports: [NatsModule, LoggerModule],
      providers: [
        {
          provide: JetStreamReaderService,
          useFactory: async (nats: NatsConnection, logger: Logger) => {
            const service = new JetStreamReaderServiceImpl(nats, logger);
            await service.setup();
            await service.createStream(options.streamName);
            await service.setupConsumer(options.streamName, options.durableName, options.subject);
            return service;
          },
          inject: [NATS_CONNECTION, Logger],
        },
      ],
      exports: [JetStreamReaderService],
    };
  }
}
