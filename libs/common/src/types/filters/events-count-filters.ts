import { EventType, FunnelStage, Source } from '@app/common/types';

export interface EventsCountFilters {
  from?: number;
  to?: number;
  source?: Source;
  funnelStage?: FunnelStage;
  eventType?: EventType
}
