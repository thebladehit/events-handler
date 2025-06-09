import { FunnelStage, Source } from '@app/common';

export const TIKTOK_TOP_EVENT_TYPE = ['video.view', 'like', 'share', 'comment'] as const;
export const TIKTOK_BOTTOM_EVENT_TYPE = ['profile.visit', 'purchase', 'follow'] as const;

export type TiktokTopEventType = typeof TIKTOK_TOP_EVENT_TYPE[number];
export type TiktokBottomEventType = typeof TIKTOK_BOTTOM_EVENT_TYPE[number] ;
export type TiktokEventType = TiktokTopEventType | TiktokBottomEventType;

export interface TiktokUser {
  userId: string;
  username: string;
  followers: number;
}

export interface TiktokEngagementTop {
  watchTime: number;
  percentageWatched: number;
  device: 'Android' | 'iOS' | 'Desktop';
  country: string;
  videoId: string;
}

export interface TiktokEngagementBottom {
  actionTime: string;
  profileId: string | null;
  purchasedItem: string | null;
  purchaseAmount: string | null;
}

export type TiktokEngagement = TiktokEngagementTop | TiktokEngagementBottom;

export interface TiktokEvent {
  eventId: string;
  timestamp: string;
  source: Source.TIKTOK;
  funnelStage: FunnelStage;
  eventType: TiktokEventType;
  data: {
    user: TiktokUser;
    engagement: TiktokEngagement;
  };
}
