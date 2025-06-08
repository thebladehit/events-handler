import { DynamicModule, Module } from '@nestjs/common';
import {
  JetStreamWriterService,
  JetStreamWriterServiceImpl,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class JetStreamWriterModule {
  static forRoot(options: { streamName: string }): DynamicModule {
    return {
      module: JetStreamWriterModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: JetStreamWriterService,
          useFactory: async (configService: ConfigService) => {
            const service = new JetStreamWriterServiceImpl(configService);
            await service.connect();
            await service.createStream(options.streamName);
            return service;
          },
          inject: [ConfigService],
        },
      ],
      exports: [JetStreamWriterService],
    };
  }
}
