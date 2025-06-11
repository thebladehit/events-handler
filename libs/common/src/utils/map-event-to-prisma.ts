import { Event } from '@app/common';
import {
  FacebookEventType,
  FunnelStage,
  Source,
  TiktokEventType,
} from '@prisma/client';
import { convertToPrismaEventType } from '@app/common/utils';

export const mapEventToPrismaType = <
  T extends FacebookEventType | TiktokEventType,
>(
  event: Event
) => {
  return {
    id: event.eventId,
    timestamp: event.timestamp,
    source: event.source.toUpperCase() as unknown as Source,
    funnelStage: event.funnelStage.toUpperCase() as unknown as FunnelStage,
    eventType: convertToPrismaEventType<T>(event.eventType),
    userId: event.data.user.userId,
  };
};
