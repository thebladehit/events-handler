import { TiktokRepository } from './interfaces';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma';
import {
  FunnelStage as PrismaFunnelStage,
  TiktokEventType,
} from '@prisma/client';
import {
  convertToPrismaEventType,
  mapEventToPrismaType,
} from '@app/common/utils';
import {
  EventsCountFilters,
  EventsDemographicsFilters,
  EventsRevenueFilters,
  TIKTOK_EVENT_TYPE,
  TiktokEvent,
} from '@app/common/types';

@Injectable()
export class TiktokRepositoryImpl implements TiktokRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async saveMany(events: TiktokEvent[]): Promise<void> {
    await this.prismaService.$transaction([
      this.prismaService.tiktokUser.createMany({
        data: this.getUsersDataForCreation(events),
        skipDuplicates: true,
      }),
      this.prismaService.tiktokEvent.createMany({
        data: events.map(mapEventToPrismaType<TiktokEventType>),
        skipDuplicates: true,
      }),
      this.prismaService.tiktokEngagement.createMany({
        data: this.getEngagementsDataForCreation(events),
      }),
    ]);
  }

  async getAggregatedEvents(
    filters: EventsCountFilters
  ): Promise<{ count: number }> {
    const count = await this.prismaService.tiktokEvent.aggregate({
      where: {
        timestamp: {
          gte: filters.from ? new Date(filters.from) : undefined,
          lte: filters.to ? new Date(filters.to) : undefined,
        },
        funnelStage:
          (filters.funnelStage?.toUpperCase() as PrismaFunnelStage) ??
          undefined,
        eventType:
          filters.eventType &&
          TIKTOK_EVENT_TYPE.includes(filters.eventType as any)
            ? convertToPrismaEventType<TiktokEventType>(filters.eventType)
            : undefined,
      },
      _count: true,
    });
    return { count: count._count };
  }

  async getAggregatedRevenue(
    filters: EventsRevenueFilters
  ): Promise<{ revenue: number }> {
    const revenue = await this.prismaService.tiktokEngagement.aggregate({
      where: {
        purchaseAmount: { not: null },
        event: {
          timestamp: {
            gte: filters.from ? new Date(filters.from) : undefined,
            lte: filters.to ? new Date(filters.to) : undefined,
          },
          eventType:
            filters.eventType &&
            TIKTOK_EVENT_TYPE.includes(filters.eventType as any)
              ? convertToPrismaEventType<TiktokEventType>(filters.eventType)
              : undefined,
        },
      },
      _sum: {
        purchaseAmount: true,
      },
    });
    return { revenue: revenue._sum.purchaseAmount };
  }

  async getAggregatedDemographics(
    filters: EventsDemographicsFilters
  ): Promise<{ userCount: number }> {
    const userCount = await this.prismaService.tiktokUser.aggregate({
      where: {
        followers: filters.followers ?? undefined,
        events: {
          some: {
            timestamp: {
              gte: filters.from ? new Date(filters.from) : undefined,
              lte: filters.to ? new Date(filters.to) : undefined,
            },
            engagement: {
              country: filters.country ?? undefined,
              device: filters.device ?? undefined,
            },
          },
        },
      },
      _count: true,
    });
    return { userCount: userCount._count };
  }

  private getUsersDataForCreation(events: TiktokEvent[]) {
    return events.map((event) => ({
      id: event.data.user.userId,
      username: event.data.user.username,
      followers: event.data.user.followers,
    }));
  }

  private getEngagementsDataForCreation(events: TiktokEvent[]) {
    return events.map((event) => ({
      watchTime: event.data.engagement['watchTime'] ?? null,
      percentageWatched: event.data.engagement['percentageWatched'] ?? null,
      device: event.data.engagement['device'] ?? null,
      country: event.data.engagement['country'] ?? null,
      videoId: event.data.engagement['videoId'] ?? null,
      actionTime: event.data.engagement['actionTime'] ?? null,
      profileId: event.data.engagement['profileId'] ?? null,
      purchasedItem: event.data.engagement['purchasedItem'] ?? null,
      purchaseAmount: event.data.engagement['purchaseAmount']
        ? Number(event.data.engagement['purchaseAmount'])
        : null,
      eventId: event.eventId,
    }));
  }
}
