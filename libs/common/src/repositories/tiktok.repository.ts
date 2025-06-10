import { TiktokRepository } from './interfaces';
import { Injectable } from '@nestjs/common';
import { TiktokEvent } from '@app/common';
import { PrismaService } from '@app/common/prisma';
import { FunnelStage as PrismaFunnelStage, Source as PrismaSource, TiktokEventType } from '@prisma/client';
import { mapEventToPrismaType } from '@app/common/utils';
import { EventFilters } from '@app/common/types/filters/events-filters';

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

  getAggregatedEvents(filters: EventFilters): Promise<{ _count: number }> {
    return this.prismaService.tiktokEvent.aggregate({
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
          (filters.eventType?.toUpperCase() as TiktokEventType) ?? undefined,
      },
      _count: true,
    });
  }
}
