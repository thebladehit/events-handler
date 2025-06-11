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
import { JetStreamWriterService } from '@app/common/jet-streams';
import { Event, SubjectName } from '@app/common/types';

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

  async publish(subject: string, data: Event): Promise<void> {
    const encoded = this.codec.encode(data);
    await this.js.publish(subject, encoded);
  }
}
