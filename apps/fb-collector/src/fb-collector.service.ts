import { Injectable, OnModuleInit } from '@nestjs/common';
import { FacebookEvent, JetStreamReaderService } from '@app/common';
import { FacebookRepository } from '@app/common/repositories';

@Injectable()
export class FbCollectorService implements OnModuleInit {
  constructor(
    private readonly jetStreamReaderService: JetStreamReaderService,
    private readonly fbRepository: FacebookRepository
  ) {}

  async onModuleInit() {
    this.consumeLoop();
  }

  private async consumeLoop() {
    while (true) {
      try {
        const events = await this.jetStreamReaderService.pull(100);
        if (events.length === 0) {
          await this.wait(1);
          continue;
        }
        await this.fbRepository.saveMany(events as FacebookEvent[]);
        this.jetStreamReaderService.acknowledgeEvents();
      } catch (err) {
        // TODO add logger
        console.error(err);
      }
    }
  }

  private async wait(seconds: number): Promise<void> {
    return new Promise((res) => setTimeout(res, seconds * 1000));
  }
}
