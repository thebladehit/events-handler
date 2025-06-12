import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { FacebookRepository } from '@app/common/repositories';
import { ConfigService } from '@nestjs/config';
import { wait } from '@app/common/utils';
import { JetStreamReaderService } from '@app/common/jet-streams';
import { Event, FacebookEvent } from '@app/common/types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventProcessing } from './constance/events-constance';

@Injectable()
export class FbCollectorService implements OnModuleInit, OnModuleDestroy {
  private readonly batchSize: number;
  private isRunning = false;
  private inProgressCount: number = 0;

  constructor(
    private readonly jetStreamReaderService: JetStreamReaderService,
    private readonly fbRepository: FacebookRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2
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
        const events = await this.getEvents();
        this.eventEmitter.emit(EventProcessing.ACCEPTED_EVENTS, events.length);
        await this.fbRepository
          .saveMany(events as FacebookEvent[])
          .catch((err) => {
            this.eventEmitter.emit(EventProcessing.FAILED_EVENTS, events.length);
            throw err;
          });
        this.jetStreamReaderService.acknowledgeEvents();
        this.eventEmitter.emit(EventProcessing.PROCESSED_EVENTS, events.length);
      } catch (err) {
        // TODO add logger
        console.error(err);
      } finally {
        this.inProgressCount--;
      }
    }
  }

  private async getEvents(): Promise<Event[]> {
    while (true) {
      const events = await this.jetStreamReaderService.pull(this.batchSize);
      if (events.length === 0) {
        await wait(1);
        continue;
      }
      return events;
    }
  }
}
