import { Gender, Source } from '@app/common';

export interface EventsDemographicsFilters {
  from: number;
  to: number;
  source: Source;
  age?: number;
  gender?: Gender;
  city?: string;
  country?: string;
  followers?: number;
  device?: string;
}
