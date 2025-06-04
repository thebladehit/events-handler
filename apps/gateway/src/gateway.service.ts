import { Injectable } from '@nestjs/common';
import { Event, NatsService, Source, SubjectName } from '@app/common';

@Injectable()
export class GatewayService {
  constructor(private readonly natsService: NatsService) {}

  async handleEvent(events: Event[]): Promise<void> {
    const requests = [];
    for (const event of events) {
      const subjectName =
        event.source === Source.TIKTOK
          ? SubjectName.TIKTOK
          : SubjectName.FACEBOOK;
      requests.push(this.natsService.publish(subjectName, event));
    }
    await Promise.allSettled(requests);
  }
}
