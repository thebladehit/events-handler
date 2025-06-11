import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { JetStreamReaderService, TiktokEvent } from '@app/common';
import { TiktokRepository } from '@app/common/repositories';
import { ConfigService } from '@nestjs/config';
import { wait } from '@app/common/utils';

@Injectable()
export class TtkCollectorService implements OnModuleInit, OnModuleDestroy {
  private readonly batchSize: number;
  private isRunning = false;
  private inProgressCount: number = 0;

  constructor(
    private readonly jetStreamReaderService: JetStreamReaderService,
    private readonly ttkRepository: TiktokRepository,
    private readonly configService: ConfigService
  ) {
    this.batchSize = this.configService.get('BATCH_SIZE');
  }

  onModuleInit() {
    this.isRunning = true;
    this.consumeLoop();
  }

  async onModuleDestroy() {
    this.isRunning = false;
    while (this.inProgressCount) {
      await wait(0.5);
    }
  }

  private async consumeLoop() {
    while (this.isRunning) {
      this.inProgressCount++;
      try {
        const events = await this.jetStreamReaderService.pull(this.batchSize);
        if (events.length === 0) {
          await wait(1);
          continue;
        }
        await this.ttkRepository.saveMany(events as TiktokEvent[]);
        this.jetStreamReaderService.acknowledgeEvents();
      } catch (err) {
        // TODO add logger
        console.error(err);
      } finally {
        this.inProgressCount--;
      }
    }
  }
}
