import { FacebookEvent } from '@app/common/types';
import { EventsCountFilters } from '@app/common/types/filters/events-count-filters';
import { EventsRevenueFilters } from '@app/common/types/filters/events-revenue-filters';
import { EventsDemographicsFilters } from '@app/common/types/filters/events-demographics-filters';

export abstract class FacebookRepository {
  abstract saveMany(events: FacebookEvent[]): Promise<void>;
  abstract getAggregatedEvents(filters: EventsCountFilters): Promise<{ count: number }>;
  abstract getAggregatedRevenue(filters: EventsRevenueFilters): Promise<{ revenue: number }>;
  abstract getAggregatedDemographics(filters: EventsDemographicsFilters): Promise<{ userCount: number }>;
}