import { Event } from '@app/common/types';

export abstract class JetStreamReaderService {
  abstract connect(): Promise<void>;
  abstract createStream(streamName: string): Promise<void>;
  abstract setupConsumer(streamName: string, durableName: string, subject: string): Promise<void>;
  abstract pull(batchSize: number): Promise<Event[]>;
  abstract acknowledgeEvents(): void;
}
