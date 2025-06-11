import { Source, TransactionalEventType } from '@app/common';

export interface EventsRevenueFilters {
  eventType: TransactionalEventType;
  from: number;
  to: number;
  source: Source;
  campaignId?: string;
}