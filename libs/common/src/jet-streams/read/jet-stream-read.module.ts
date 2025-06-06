import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JetStreamReaderService } from '@app/common';
import { JetStreamReaderServiceImpl } from '@app/common/jet-streams/read/jet-stream-readerImpl.service';

@Module({})
export class JetStreamReadModule {
  static forRoot(options: {
    streamName: string;
    durableName: string;
    subject: string;
  }): DynamicModule {
    return {
      module: JetStreamReadModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: JetStreamReaderService,
          useFactory: async (configService: ConfigService) => {
            const service = new JetStreamReaderServiceImpl(configService);
            await service.connect();
            await service.createStream(options.streamName, [options.subject]);
            await service.setupConsumer(options.streamName, options.durableName, options.subject);
            return service;
          },
          inject: [ConfigService],
        },
      ],
      exports: [JetStreamReaderService],
    };
  }
}
