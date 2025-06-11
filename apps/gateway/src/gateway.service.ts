import { Injectable } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { JetStreamWriterService } from '@app/common/jet-streams';
import { Event, Source, SubjectName } from '@app/common/types';

@Injectable()
export class GatewayService {
  constructor(
    private readonly jetStreamWriterService: JetStreamWriterService
  ) {}

  async handleEvent(events: EventDto[]): Promise<void> {
    const requests = [];
    for (const event of events) {
      const subjectName =
        event.source === Source.TIKTOK
          ? SubjectName.TIKTOK
          : SubjectName.FACEBOOK;
      requests.push(this.jetStreamWriterService.publish(subjectName, event as Event));
    }
    await Promise.allSettled(requests);
  }
}
