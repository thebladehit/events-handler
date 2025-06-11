import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { FacebookEvent, JetStreamReaderService } from '@app/common';
import { FacebookRepository } from '@app/common/repositories';
import { ConfigService } from '@nestjs/config';
import { wait } from '@app/common/utils';

@Injectable()
export class FbCollectorService implements OnModuleInit, OnModuleDestroy {
  private readonly batchSize: number;
  private isRunning = false;
  private inProgressCount: number = 0;

  constructor(
    private readonly jetStreamReaderService: JetStreamReaderService,
    private readonly fbRepository: FacebookRepository,
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
        await this.fbRepository.saveMany(events as FacebookEvent[]);
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
