export abstract class JetStreamWriterService {
  abstract connect(): Promise<void>;
  abstract createStream(streamName: string, subjects: string[]): Promise<void>;
  abstract publish(subject: string, data: any): Promise<void>;
}
