import { TiktokRepository } from './interfaces';
import { Injectable } from '@nestjs/common';
import { TiktokEvent } from '@app/common';
import { PrismaService } from '@app/common/prisma';
import { TiktokEventType } from '@prisma/client';
import { mapEventToPrismaType } from '@app/common/utils';

@Injectable()
export class TiktokRepositoryImpl implements TiktokRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async saveMany(events: TiktokEvent[]): Promise<void> {
    await this.prismaService.tiktokUser.createMany({
      data: events.map((event) => ({
        id: event.data.user.userId,
        username: event.data.user.username,
        followers: event.data.user.followers,
      })),
      skipDuplicates: true,
    });

    await this.prismaService.tiktokEvent.createMany({
      data: events.map(mapEventToPrismaType<TiktokEventType>),
      skipDuplicates: true,
    });
  }

  get(): Promise<any> {
    return Promise.resolve(undefined);
  }
}
