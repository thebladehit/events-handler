import { IsString, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class TiktokUserDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsNumber()
  followers: number;
}

export class TiktokDataDto {
  @ValidateNested()
  @Type(() => TiktokUserDto)
  user: TiktokUserDto;

  @IsObject()
  engagement: any;
}
