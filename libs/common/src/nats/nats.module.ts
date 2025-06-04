import { Module, OnModuleInit } from '@nestjs/common';
import { NatsService } from './nats.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [NatsService],
  exports: [NatsService],
})
export class NatsModule implements OnModuleInit {
  constructor(private readonly natsService: NatsService) {}

  async onModuleInit(): Promise<void> {
    await this.natsService.connect();
    await this.natsService.createStreams();
  }
}
