import { TiktokEvent } from '@app/common/types';

export abstract class TiktokRepository {
  abstract saveMany(events: TiktokEvent[]): Promise<void>;
  abstract get(): Promise<any>;
}