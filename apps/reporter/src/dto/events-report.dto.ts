import {
  IsDefined,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EVENT_TYPE,
  EventType,
  FACEBOOK_EVENT_TYPE,
  FUNNEL_STAGE,
  FunnelStage,
  Source,
  TIKTOK_EVENT_TYPE,
} from '@app/common/types';

export class EventsReportDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  from?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  to?: number;

  @ValidateIf(
    (object) => object.from && object.to && +object.to <= +object.from
  )
  @IsDefined({ message: 'to must be greater than from' })
  protected readonly fromGreaterThanTo: undefined;

  @IsOptional()
  @IsEnum(Source)
  source?: Source;

  @IsOptional()
  @IsIn(FUNNEL_STAGE)
  funnelStage?: FunnelStage;

  @IsOptional()
  @IsIn(EVENT_TYPE)
  eventType?: EventType;

  @ValidateIf((object) => {
    if (!object.source || !object.eventType) return false;
    return object.source === Source.TIKTOK
      ? !TIKTOK_EVENT_TYPE.includes(object.eventType)
      : !FACEBOOK_EVENT_TYPE.includes(object.eventType);
  })
  @IsDefined({ message: `invalid event type for that source` })
  protected readonly validEventForSource: undefined;
}
