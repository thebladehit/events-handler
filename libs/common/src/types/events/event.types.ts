import {
  FACEBOOK_BOTTOM_EVENT_TYPE,
  FACEBOOK_TOP_EVENT_TYPE, FACEBOOK_TRANSACTIONAL_EVENT_TYPE,
  FacebookEvent, TIKTOK_BOTTOM_EVENT_TYPE,
  TIKTOK_TOP_EVENT_TYPE, TIKTOK_TRANSACTIONAL_EVENT_TYPE,
  TiktokEvent,
} from './index';

export const EVENT_TYPE = [
  ...TIKTOK_TOP_EVENT_TYPE,
  ...TIKTOK_BOTTOM_EVENT_TYPE,
  ...FACEBOOK_BOTTOM_EVENT_TYPE,
  ...FACEBOOK_TOP_EVENT_TYPE,
] as const;
export const TRANSACTIONAL_EVENT_TYPE = [...TIKTOK_TRANSACTIONAL_EVENT_TYPE, ...FACEBOOK_TRANSACTIONAL_EVENT_TYPE] as const;
export const FUNNEL_STAGE = ['top', 'bottom'] as const;
export type FunnelStage = (typeof FUNNEL_STAGE)[number];
export type Event = FacebookEvent | TiktokEvent;
export type EventType = (typeof EVENT_TYPE)[number];
export type TransactionalEventType = (typeof TRANSACTIONAL_EVENT_TYPE)[number];

export enum Source {
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok',
}
