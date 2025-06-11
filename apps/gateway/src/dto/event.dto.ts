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
  EVENT_TYPE,
  EventType,
  FUNNEL_STAGE,
  FunnelStage,
  Source,
} from '@app/common/types';


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

  @IsIn(EVENT_TYPE)
  eventType: EventType;

  @ValidateNested()
  @Type((opts) => {
    const source = opts?.object?.source;
    if (source === Source.FACEBOOK) return FacebookDataDto;
    if (source === Source.TIKTOK) return TiktokDataDto;
  })
  data: FacebookDataDto | TiktokDataDto;
}
