import { Event } from '@app/common/types';

export abstract class JetStreamWriterService {
  abstract setup(): Promise<void>;
  abstract createStream(streamName: string): Promise<void>;
  abstract publish(subject: string, data: Event): Promise<void>;
}
