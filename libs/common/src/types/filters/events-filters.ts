import { EventType, FunnelStage, Source } from '@app/common';

export interface EventFilters {
  from?: number;
  to?: number;
  source?: Source;
  funnelStage?: FunnelStage;
  eventType?: EventType
}
