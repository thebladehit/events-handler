import { Event } from '@app/common';
import {
  FacebookEventType,
  FunnelStage,
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
    funnelStage: event.funnelStage.toUpperCase() as unknown as FunnelStage,
    eventType: convertToPrismaEventType<T>(event.eventType),
    userId: event.data.user.userId,
  };
};
