import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TiktokRepository } from '@app/common/repositories';
import { ConfigService } from '@nestjs/config';
import { wait } from '@app/common/utils';
import { JetStreamReaderService } from '@app/common/jet-streams';
import { Event, TiktokEvent } from '@app/common/types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventProcessing } from './constance/events-constance';
import { Logger } from 'nestjs-pino';

@Injectable()
export class TtkCollectorService implements OnModuleInit, OnModuleDestroy {
  private readonly batchSize: number;
  private isRunning = false;
  private inProgressCount: number = 0;

  constructor(
    private readonly jetStreamReaderService: JetStreamReaderService,
    private readonly ttkRepository: TiktokRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: Logger
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
        await this.ttkRepository
          .saveMany(events as TiktokEvent[])
          .catch((err) => {
            this.eventEmitter.emit(EventProcessing.FAILED_EVENTS, events.length);
            throw err;
          });
        this.jetStreamReaderService.acknowledgeEvents();
        this.eventEmitter.emit(EventProcessing.PROCESSED_EVENTS, events.length);
        this.logger.log(`Saved ${events.length} events`);
      } catch (err) {
        this.logger.error(err);
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
