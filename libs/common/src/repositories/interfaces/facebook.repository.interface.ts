import { FacebookEvent } from '@app/common/types';
import { EventFilters } from '@app/common/types/filters/events-filters';

export abstract class FacebookRepository {
  abstract saveMany(events: FacebookEvent[]): Promise<void>;
  abstract getAggregatedEvents(filters: EventFilters): Promise<{ _count: number }>;
}