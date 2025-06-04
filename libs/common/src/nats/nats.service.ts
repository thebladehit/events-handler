import { Injectable } from '@nestjs/common';
import {
  connect,
  JetStreamClient,
  JetStreamManager,
  JSONCodec,
  NatsConnection,
  RetentionPolicy,
  StorageType,
} from 'nats';
import { ConfigService } from '@nestjs/config';
import { SubjectName } from '@app/common/types';

@Injectable()
export class NatsService {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private codec = JSONCodec();

  constructor(private configService: ConfigService) {}

  async connect(): Promise<void> {
    const server_url = this.configService.get<string>('NATS_URL');
    this.nc = await connect({ servers: [server_url] });
    this.js = this.nc.jetstream();
  }

  async createStreams(): Promise<void> {
    this.jsm = await this.nc.jetstreamManager();
    try {
      for (const subject of Object.values(SubjectName)) {
        await this.jsm.streams.add({
          name: subject,
          subjects: [subject],
          storage: StorageType.File,
          retention: RetentionPolicy.Limits,
        });
      }
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
