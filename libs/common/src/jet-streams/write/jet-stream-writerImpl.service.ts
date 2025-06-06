import { Injectable } from '@nestjs/common';
import {
  JetStreamClient,
  JetStreamManager,
  JSONCodec,
  NatsConnection,
  connect,
  StorageType,
  RetentionPolicy,
} from 'nats';
import { ConfigService } from '@nestjs/config';
import { JetStreamWriterService } from '@app/common';

@Injectable()
export class JetStreamWriterServiceImpl implements JetStreamWriterService {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private codec = JSONCodec();

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

  async publish(subject: string, data: any): Promise<void> {
    const encoded = this.codec.encode(data);
    await this.js.publish(subject, encoded);
  }
}
