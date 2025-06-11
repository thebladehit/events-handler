import { TiktokEvent } from '@app/common/types';
import { EventsAggregationFilters } from '@app/common/types/filters/events-aggregation-filters';
import { EventsRevenueFilters } from '@app/common/types/filters/events-revenue-filters';

export abstract class TiktokRepository {
  abstract saveMany(events: TiktokEvent[]): Promise<void>;
  abstract getAggregatedEvents(filters: EventsAggregationFilters): Promise<{ _count: number }>;
  abstract getAggregatedRevenue(filters: EventsRevenueFilters): Promise<any>;
}