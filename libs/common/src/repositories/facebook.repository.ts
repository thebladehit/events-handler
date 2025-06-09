import { FacebookEventType, FunnelStage, Source } from '@prisma/client';
import { FacebookEvent } from '@app/common';
import { FacebookRepository } from './interfaces';
import { PrismaService } from '@app/common/prisma';
import { Injectable } from '@nestjs/common';

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
      data: events.map(this.mapFacebookEvent),
      skipDuplicates: true,
    });
  }

  get(): Promise<any> {
    return Promise.resolve(undefined);
  }

  private mapFacebookEvent(event: FacebookEvent) {
    return {
      id: event.eventId,
      timestamp: event.timestamp,
      source: event.source.toUpperCase() as unknown as Source,
      funnelStage: event.funnelStage.toUpperCase() as unknown as FunnelStage,
      eventType: event.eventType
        .replace('.', '_')
        .toUpperCase() as unknown as FacebookEventType,
      userId: event.data.user.userId,
      engagement: JSON.stringify(event.data.engagement),
    };
  }
}
