import { DynamicModule, Module } from '@nestjs/common';
import { JetStreamWriterService } from '@app/common/jet-streams';
import { NATS_CONNECTION, NatsModule } from '@app/common/jet-streams/nats';
import { NatsConnection } from 'nats';
import { JetStreamWriterServiceImpl } from '@app/common/jet-streams/write/jet-stream-writerImpl.service';
import { LoggerModule } from '@app/common/logger';
import { Logger } from 'nestjs-pino';

@Module({})
export class JetStreamWriterModule {
  static forRoot(options: { streamName: string }): DynamicModule {
    return {
      module: JetStreamWriterModule,
      imports: [NatsModule, LoggerModule],
      providers: [
        {
          provide: JetStreamWriterService,
          useFactory: async (nats: NatsConnection, logger: Logger) => {
            const service = new JetStreamWriterServiceImpl(nats, logger);
            await service.setup();
            await service.createStream(options.streamName);
            return service;
          },
          inject: [NATS_CONNECTION, Logger],
        },
      ],
      exports: [JetStreamWriterService],
    };
  }
}
