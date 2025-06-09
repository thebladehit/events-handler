import { Injectable } from '@nestjs/common';
import { JetStreamWriterService, Source, SubjectName } from '@app/common';
import { EventDto } from './dto/event.dto';

@Injectable()
export class GatewayService {
  constructor(private readonly jetStreamWriterService: JetStreamWriterService) {}

  async handleEvent(events: EventDto[]): Promise<void> {
    const requests = [];
    for (const event of events) {
      const subjectName =
        event.source === Source.TIKTOK
          ? SubjectName.TIKTOK
          : SubjectName.FACEBOOK;
      requests.push(this.jetStreamWriterService.publish(subjectName, event));
    }
    await Promise.allSettled(requests);
  }
}
