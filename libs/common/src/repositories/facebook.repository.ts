import { FacebookEvent } from '@app/common';
import { FacebookRepository } from './interfaces';
import { PrismaService } from '@app/common/prisma';
import { Injectable } from '@nestjs/common';
import { FacebookEventType } from '@prisma/client';
import { mapEventToPrismaType } from '@app/common/utils';
import { EventFilters } from '@app/common/types/filters/events-filters';
import {
  Source as PrismaSource,
  FunnelStage as PrismaFunnelStage,
} from '@prisma/client';

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

  getAggregatedEvents(filters: EventFilters): Promise<{ _count: number }> {
    return this.prismaService.facebookEvent.aggregate({
      where: {
        timestamp: {
          gte: filters.from ? new Date(filters.from) : undefined,
          lte: filters.to ? new Date(filters.to) : undefined,
        },
        source: (filters.source?.toUpperCase() as PrismaSource) ?? undefined,
        funnelStage:
          (filters.funnelStage?.toUpperCase() as PrismaFunnelStage) ??
          undefined,
        eventType:
          (filters.eventType?.toUpperCase() as FacebookEventType) ?? undefined,
      },
      _count: true,
    });
  }
}
