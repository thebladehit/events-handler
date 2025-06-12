import { DynamicModule, Module } from '@nestjs/common';
import { JetStreamWriterService } from '@app/common/jet-streams';
import { NATS_CONNECTION, NatsModule } from '@app/common/jet-streams/nats';
import { NatsConnection } from 'nats';
import { JetStreamWriterServiceImpl } from '@app/common/jet-streams/write/jet-stream-writerImpl.service';

@Module({})
export class JetStreamWriterModule {
  static forRoot(options: { streamName: string }): DynamicModule {
    return {
      module: JetStreamWriterModule,
      imports: [NatsModule],
      providers: [
        {
          provide: JetStreamWriterService,
          useFactory: async (nats: NatsConnection) => {
            const service = new JetStreamWriterServiceImpl(nats);
            await service.setup();
            await service.createStream(options.streamName);
            return service;
          },
          inject: [NATS_CONNECTION],
        },
      ],
      exports: [JetStreamWriterService],
    };
  }
}
