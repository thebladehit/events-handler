import { Injectable } from '@nestjs/common';
import {
  JetStreamClient,
  JetStreamManager,
  JSONCodec,
  NatsConnection,
  StorageType,
  RetentionPolicy,
  Consumer,
  AckPolicy,
  JsMsg,
} from 'nats';
import { JetStreamReaderService } from '../interfaces';
import { Event, SubjectName } from '@app/common/types';

@Injectable()
export class JetStreamReaderServiceImpl implements JetStreamReaderService {
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private codec = JSONCodec();
  private consumer: Consumer;
  private activeEvents: JsMsg[] = [];

  constructor(private readonly nats: NatsConnection) {}

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
        // TODO add logger
        console.error(err);
      }
    }
  }

  async setupConsumer(
    streamName: string,
    durableName: string,
    subject: string
  ): Promise<void> {
    try {
      await this.jsm.consumers.add(streamName, {
        ack_policy: AckPolicy.Explicit,
        durable_name: durableName,
        filter_subject: subject,
      });
    } catch (err) {
      // TODO add logger
      console.error(err);
    } finally {
      this.consumer = await this.js.consumers.get(streamName, durableName);
    }
  }

  async pull(batchSize: number): Promise<Event[]> {
    const iter = await this.consumer.fetch({ max_messages: batchSize });
    const events: Event[] = [];
    for await (const m of iter) {
      const decoded = this.codec.decode(m.data) as Event;
      events.push(decoded);
      this.activeEvents.push(m);
    }
    return events;
  }

  acknowledgeEvents(): void {
    for (const event of this.activeEvents) {
      event.ack();
    }
    this.activeEvents = [];
  }
}
