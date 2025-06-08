import { FacebookEvent, TiktokEvent } from '@app/common/types';

export type FunnelStage = 'top' | 'bottom';
export type Event = FacebookEvent | TiktokEvent;

export enum Source {
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok',
}
