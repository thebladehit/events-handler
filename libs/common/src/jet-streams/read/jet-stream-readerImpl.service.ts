import { Injectable } from '@nestjs/common';
import {
  JetStreamClient,
  JetStreamManager,
  JSONCodec,
  NatsConnection,
  connect,
  StorageType,
  RetentionPolicy,
  Consumer,
  AckPolicy,
  JsMsg,
} from 'nats';
import { ConfigService } from '@nestjs/config';
import { Event, JetStreamReaderService } from '@app/common';

@Injectable()
export class JetStreamReaderServiceImpl implements JetStreamReaderService {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private codec = JSONCodec();
  private consumer: Consumer;
  private activeEvents: JsMsg[] = [];

  constructor(private configService: ConfigService) {}

  async connect(): Promise<void> {
    const server_url = this.configService.get<string>('NATS_URL');
    this.nc = await connect({ servers: [server_url] });
    this.js = this.nc.jetstream();
    this.jsm = await this.js.jetstreamManager();
  }

  async createStream(streamName: string, subjects: string[]): Promise<void> {
    try {
      const info = await this.jsm.streams.info(streamName);
      if (info) return;
      await this.jsm.streams.add({
        name: streamName,
        subjects: subjects,
        storage: StorageType.File,
        retention: RetentionPolicy.Limits,
      });
    } catch (err) {
      // TODO add logger
      console.error(err);
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
