import { FacebookEvent, mapEventToPrismaType } from '@app/common';
import { FacebookRepository } from './interfaces';
import { PrismaService } from '@app/common/prisma';
import { Injectable } from '@nestjs/common';
import { FacebookEventType } from '@prisma/client';

@Injectable()
export class FacebookRepositoryImpl implements FacebookRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async saveMany(events: FacebookEvent[]): Promise<void> {
    await this.prismaService.facebookUser.createMany({
      data: events.map((event) => ({
        id: event.data.user.userId,
        name: event.data.user.name,
        age: event.data.user.age,
        gender: event.data.user.gender,
        location: JSON.stringify(event.data.user.location),
      })),
      skipDuplicates: true,
    });

    await this.prismaService.facebookEvent.createMany({
      data: events.map(mapEventToPrismaType<FacebookEventType>),
      skipDuplicates: true,
    });
  }

  get(): Promise<any> {
    return Promise.resolve(undefined);
  }
}
