import { Gender, Source } from '@app/common/types';

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
