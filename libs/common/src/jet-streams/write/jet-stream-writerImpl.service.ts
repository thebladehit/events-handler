import { Injectable } from '@nestjs/common';
import {
  JetStreamClient,
  JetStreamManager,
  JSONCodec,
  NatsConnection,
  StorageType,
  RetentionPolicy,
} from 'nats';
import { JetStreamWriterService } from '@app/common/jet-streams';
import { Event, SubjectName } from '@app/common/types';
import { Logger } from 'nestjs-pino';

@Injectable()
export class JetStreamWriterServiceImpl implements JetStreamWriterService {
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private codec = JSONCodec();

  constructor(
    private readonly nats: NatsConnection,
    private readonly logger: Logger
  ) {}

  async setup(): Promise<void> {
    this.js = this.nats.jetstream();
    this.jsm = await this.js.jetstreamManager();
  }

  async createStream(streamName: string): Promise<void> {
    try {
      await this.jsm.streams.info(streamName);
    } catch (err) {
      if (Number(err.code) === 404) {
        await this.jsm.streams.add({
          name: streamName,
          subjects: [...Object.values(SubjectName)],
          storage: StorageType.File,
          retention: RetentionPolicy.Limits,
        });
      } else {
        this.logger.error(err);
      }
    }
  }

  async publish(subject: string, data: Event): Promise<void> {
    const encoded = this.codec.encode(data);
    await this.js.publish(subject, encoded);
  }
}
