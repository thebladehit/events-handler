import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { connect, NatsConnection } from 'nats';

export const NATS_CONNECTION = 'NATS_CONNECTION';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: NATS_CONNECTION,
      useFactory: async (configService: ConfigService): Promise<NatsConnection> => {
        return await connect({
          servers: configService.get<string>('NATS_URL'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [NATS_CONNECTION],
})
export class NatsModule {}
