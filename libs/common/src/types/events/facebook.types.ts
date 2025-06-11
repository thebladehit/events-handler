import { FunnelStage, Source } from '@app/common/types';

export const GENDER = ['male', 'female', 'non-binary'] as const;
export const FACEBOOK_TOP_EVENT_TYPE = ['ad.view', 'page.like', 'comment', 'video.view'] as const;
export const FACEBOOK_BOTTOM_EVENT_TYPE = ['ad.click', 'form.submission', 'checkout.complete'] as const;
export const FACEBOOK_EVENT_TYPE = [...FACEBOOK_BOTTOM_EVENT_TYPE, ...FACEBOOK_TOP_EVENT_TYPE] as const;
export const FACEBOOK_TRANSACTIONAL_EVENT_TYPE = ['checkout.complete'] as const;

export type Gender = typeof GENDER[number];

export type FacebookTopEventType = typeof FACEBOOK_TOP_EVENT_TYPE[number];
export type FacebookBottomEventType = typeof FACEBOOK_BOTTOM_EVENT_TYPE[number];
export type FacebookEventType = FacebookTopEventType | FacebookBottomEventType;

export interface FacebookUserLocation {
  country: string;
  city: string;
}

export interface FacebookUser {
  userId: string;
  name: string;
  age: number;
  gender: Gender;
  location: FacebookUserLocation;
}

export interface FacebookEngagementTop {
  actionTime: string;
  referrer: 'newsfeed' | 'marketplace' | 'groups';
  videoId: string | null;
}

export interface FacebookEngagementBottom {
  adId: string;
  campaignId: string;
  clickPosition: 'top_left' | 'bottom_right' | 'center';
  device: 'mobile' | 'desktop';
  browser: 'Chrome' | 'Firefox' | 'Safari';
  purchaseAmount: string | null;
}

export type FacebookEngagement =
  | FacebookEngagementTop
  | FacebookEngagementBottom;

export interface FacebookEvent {
  eventId: string;
  timestamp: string;
  source: Source.FACEBOOK;
  funnelStage: FunnelStage;
  eventType: FacebookEventType;
  data: {
    user: FacebookUser;
    engagement: FacebookEngagement;
  };
}
