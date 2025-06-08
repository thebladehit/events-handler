import { FacebookEvent } from '@app/common/types';

export abstract class FacebookRepository {
  abstract saveMany(events: FacebookEvent[]): Promise<void>;
  abstract get(): Promise<any>;
}