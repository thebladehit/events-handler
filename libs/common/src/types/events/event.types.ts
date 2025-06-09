import { FacebookEvent, TiktokEvent } from '@app/common/types';

export const FUNNEL_STAGE = ['top', 'bottom'] as const;
export type FunnelStage = typeof FUNNEL_STAGE[number];
export type Event = FacebookEvent | TiktokEvent;

export enum Source {
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok',
}
