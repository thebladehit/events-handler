import { TiktokRepository } from './interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TiktokRepositoryImpl implements TiktokRepository {
  get(): Promise<any> {
    return Promise.resolve(undefined);
  }
}
