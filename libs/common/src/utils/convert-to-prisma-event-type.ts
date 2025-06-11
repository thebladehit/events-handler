import { FacebookEventType, TiktokEventType } from '@prisma/client';
import {EventType} from "@app/common/types";

export const convertToPrismaEventType = <
  T extends FacebookEventType | TiktokEventType,
>(
  eventType: EventType
): T => {
  return eventType.toUpperCase().replace('.', '_') as T;
};
