import { EventType, FunnelStage, Source } from '@app/common';

export interface EventsCountFilters {
  from?: number;
  to?: number;
  source?: Source;
  funnelStage?: FunnelStage;
  eventType?: EventType
}
