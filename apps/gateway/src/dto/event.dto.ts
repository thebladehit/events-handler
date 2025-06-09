import {
  IsEnum,
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FacebookDataDto } from './facebook-event.dto';
import { TiktokDataDto } from './tiktok-event.dto';
import {
  FACEBOOK_BOTTOM_EVENT_TYPE,
  FACEBOOK_TOP_EVENT_TYPE,
  FacebookEventType,
  FUNNEL_STAGE,
  FunnelStage,
  Source,
  TIKTOK_BOTTOM_EVENT_TYPE,
  TIKTOK_TOP_EVENT_TYPE,
} from '@app/common';

export class EventDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsISO8601()
  timestamp: string;

  @IsEnum(Source)
  source: Source;

  @IsIn(FUNNEL_STAGE)
  funnelStage: FunnelStage;

  @IsIn([
    ...TIKTOK_TOP_EVENT_TYPE,
    ...TIKTOK_BOTTOM_EVENT_TYPE,
    ...FACEBOOK_TOP_EVENT_TYPE,
    ...FACEBOOK_BOTTOM_EVENT_TYPE,
  ])
  eventType: FacebookEventType;

  @ValidateNested()
  @Type((opts) => {
    const source = opts?.object?.source;
    if (source === Source.FACEBOOK) return FacebookDataDto;
    if (source === Source.TIKTOK) return TiktokDataDto;
  })
  data: FacebookDataDto | TiktokDataDto;
}
