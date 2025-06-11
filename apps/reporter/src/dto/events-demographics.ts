import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { GENDER, Gender, Source } from '@app/common';

export class EventsDemographics {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  from: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  to: number;

  @IsEnum(Source)
  source: Source;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsIn(GENDER)
  gender?: Gender;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  county?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  followers?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  device: string;
}
