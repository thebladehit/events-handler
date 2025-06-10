import { TiktokEvent } from '@app/common/types';
import { EventFilters } from '@app/common/types/filters/events-filters';

export abstract class TiktokRepository {
  abstract saveMany(events: TiktokEvent[]): Promise<void>;
  abstract getAggregatedEvents(filters: EventFilters): Promise<{ _count: number }>;
}