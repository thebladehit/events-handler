import {
  FACEBOOK_EVENT_TYPE,
  Source, TIKTOK_EVENT_TYPE,
  TRANSACTIONAL_EVENT_TYPE,
  TransactionalEventType,
} from '@app/common';
import {
  IsDefined,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EventRevenueDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  from: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  to: number;

  @ValidateIf(
    (object) => object.from && object.to && +object.to <= +object.from
  )
  @IsDefined({ message: 'to must be greater than from' })
  protected readonly fromGreaterThanTo: undefined;

  @IsEnum(Source)
  source: Source;

  @IsIn(TRANSACTIONAL_EVENT_TYPE)
  eventType: TransactionalEventType;

  @ValidateIf((object) => {
    return object.source === Source.TIKTOK
      ? !TIKTOK_EVENT_TYPE.includes(object.eventType)
      : !FACEBOOK_EVENT_TYPE.includes(object.eventType);
  })
  @IsDefined({ message: `invalid event type for that source` })
  protected readonly validEventForSource: undefined;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  campaignId: string;
}
