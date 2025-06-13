import { Injectable } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { EventProcessing } from './constance/events-constance';
import { Event, Source, SubjectName } from '@app/common/types';
import { JetStreamWriterService } from '@app/common/jet-streams';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from 'nestjs-pino';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class GatewayService {
  constructor(
    private readonly jetStreamWriterService: JetStreamWriterService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: Logger
  ) {}

  async handleEvent(
    events: EventDto[]
  ): Promise<{ saved: number; failed: number }> {
    this.logger.log(`Got: ${events.length} events`);
    this.eventEmitter.emit(EventProcessing.ACCEPTED_EVENTS, events.length);

    const requests = await this.getRequests(events);
    const processedEvents = await Promise.allSettled(requests);
    this.handleErrors(processedEvents);
    const statistics = this.countStatistics(processedEvents, events.length);

    this.eventEmitter.emit(EventProcessing.FAILED_EVENTS, statistics.failed);
    this.eventEmitter.emit(EventProcessing.PROCESSED_EVENTS, statistics.saved);

    this.logger.log(`Processed: ${statistics.saved} events`);
    this.logger.log(`Failed: ${statistics.failed} events`);

    return statistics;
  }

  private async getRequests(events: EventDto[]) {
    const requests = [];
    for (const event of events) {
      const isValidEvent = await this.validateEvent(event);
      if (!isValidEvent) {
        continue;
      }
      const subjectName =
        event.source === Source.TIKTOK
          ? SubjectName.TIKTOK
          : SubjectName.FACEBOOK;
      requests.push(
        this.jetStreamWriterService.publish(subjectName, event as Event)
      );
    }
    return requests;
  }

  private countStatistics(
    processedEvents: PromiseSettledResult<any>[],
    allEventsCount: number
  ) {
    const savedEvents = processedEvents.filter(
      (processedEvents) => processedEvents.status === 'fulfilled'
    );
    return {
      saved: savedEvents.length,
      failed: allEventsCount - savedEvents.length,
    };
  }

  private async handleErrors(events: PromiseSettledResult<any>[]) {
    events.forEach((savedEvent) => {
      if (savedEvent.status === 'rejected') {
        this.logger.error(`${savedEvent.status}:${savedEvent.reason}`);
      }
    });
  }

  private async validateEvent(event: EventDto): Promise<boolean> {
    const dto = plainToInstance(EventDto, event);
    const errors = await validate(dto);
    return errors.length === 0;
  }
}
