import { TiktokEvent } from '@app/common/types/events/tiktok.types';
import { FacebookEvent } from '@app/common/types/events/facebook.types';

export type FunnelStage = 'top' | 'bottom';
export type Event = FacebookEvent | TiktokEvent;

export enum Source {
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok',
}
