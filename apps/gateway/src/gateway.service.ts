import { Injectable } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { EventProcessing } from './constance/events-constance';
import { Event, Source, SubjectName } from '@app/common/types';
import { JetStreamWriterService } from '@app/common/jet-streams';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GatewayService {
  constructor(
    private readonly jetStreamWriterService: JetStreamWriterService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async handleEvent(
    events: EventDto[]
  ): Promise<{ saved: number; failed: number }> {
    this.eventEmitter.emit(EventProcessing.ACCEPTED_EVENTS, events.length);
    const requests = [];
    for (const event of events) {
      const subjectName =
        event.source === Source.TIKTOK
          ? SubjectName.TIKTOK
          : SubjectName.FACEBOOK;
      requests.push(
        this.jetStreamWriterService.publish(subjectName, event as Event)
      );
    }
    const savedEvents = await Promise.allSettled(requests);
    this.handleErrors(savedEvents);
    const statistics = this.countStatistics(savedEvents);
    this.eventEmitter.emit(EventProcessing.FAILED_EVENTS, statistics.failed);
    this.eventEmitter.emit(EventProcessing.PROCESSED_EVENTS, statistics.saved);
    return statistics;
  }

  private countStatistics(events: PromiseSettledResult<any>[]) {
    let saved = 0;
    let failed = 0;
    events.forEach((savedEvent) => {
      if (savedEvent.status === 'rejected') {
        failed++;
      } else {
        saved++;
      }
    });
    return { saved, failed };
  }

  private async handleErrors(events: PromiseSettledResult<any>[]) {
    events.forEach((savedEvent) => {
      if (savedEvent.status === 'rejected') {
        // TODO add logger
      }
    });
  }
}
