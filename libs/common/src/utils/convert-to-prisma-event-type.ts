import { EventType } from '@app/common';
import { FacebookEventType, TiktokEventType } from '@prisma/client';

export const convertToPrismaEventType = <
  T extends FacebookEventType | TiktokEventType,
>(
  eventType: EventType
): T => {
  return eventType.toUpperCase().replace('.', '_') as T;
};
