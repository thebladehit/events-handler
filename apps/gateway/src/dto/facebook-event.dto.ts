import {
  IsIn,
  IsString,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, GENDER } from '@app/common/types';

export class FacebookUserLocationDto {
  @IsString()
  country: string;

  @IsString()
  city: string;
}

export class FacebookUserDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsIn(GENDER)
  gender: Gender;

  @ValidateNested()
  @Type(() => FacebookUserLocationDto)
  location: FacebookUserLocationDto;
}

export class FacebookDataDto {
  @ValidateNested()
  @Type(() => FacebookUserDto)
  user: FacebookUserDto;

  @IsObject()
  engagement: any;
}
