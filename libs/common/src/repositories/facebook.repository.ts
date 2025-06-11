import {
  EventsCountFilters,
  EventsRevenueFilters,
  FACEBOOK_EVENT_TYPE,
  FacebookEvent,
} from '@app/common';
import { FacebookRepository } from './interfaces';
import { PrismaService } from '@app/common/prisma';
import { Injectable } from '@nestjs/common';
import {
  convertToPrismaEventType,
  mapEventToPrismaType,
} from '@app/common/utils';
import {
  FunnelStage as PrismaFunnelStage,
  FacebookEventType,
} from '@prisma/client';
import { EventsDemographicsFilters } from '@app/common/types';

@Injectable()
export class FacebookRepositoryImpl implements FacebookRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async saveMany(events: FacebookEvent[]): Promise<void> {
    await this.prismaService.$transaction([
      this.prismaService.facebookUser.createMany({
        data: this.getUsersDataForCreation(events),
        skipDuplicates: true,
      }),
      this.prismaService.userLocation.createMany({
        data: this.getUserLocationDataForCreation(events),
        skipDuplicates: true,
      }),
      this.prismaService.facebookEvent.createMany({
        data: events.map(mapEventToPrismaType<FacebookEventType>),
        skipDuplicates: true,
      }),
      this.prismaService.facebookEngagement.createMany({
        data: this.getEngagementsDataForCreation(events),
      }),
    ]);
  }

  async getAggregatedEvents(
    filters: EventsCountFilters
  ): Promise<{ count: number }> {
    const count = await this.prismaService.facebookEvent.aggregate({
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
          FACEBOOK_EVENT_TYPE.includes(filters.eventType as any)
            ? convertToPrismaEventType<FacebookEventType>(filters.eventType)
            : undefined,
      },
      _count: true,
    });
    return { count: count._count };
  }

  async getAggregatedRevenue(
    filters: EventsRevenueFilters
  ): Promise<{ revenue: number }> {
    const revenue = await this.prismaService.facebookEngagement.aggregate({
      where: {
        purchaseAmount: { not: null },
        campaignId: filters.campaignId ?? undefined,
        event: {
          timestamp: {
            gte: filters.from ? new Date(filters.from) : undefined,
            lte: filters.to ? new Date(filters.to) : undefined,
          },
          eventType:
            filters.eventType &&
            FACEBOOK_EVENT_TYPE.includes(filters.eventType as any)
              ? convertToPrismaEventType<FacebookEventType>(filters.eventType)
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
    const userCount = await this.prismaService.facebookUser.aggregate({
      where: {
        age: filters.age ?? undefined,
        gender: filters.gender ?? undefined,
        location: {
          country: filters.country ?? undefined,
          city: filters.city ?? undefined,
        },
        events: {
          some: {
            timestamp: {
              gte: filters.from ? new Date(filters.from) : undefined,
              lte: filters.to ? new Date(filters.to) : undefined,
            },
            engagement: {
              device: filters.device ?? undefined,
            },
          },
        },
      },
      _count: true,
    });
    return { userCount: userCount._count };
  }

  private getUsersDataForCreation(events: FacebookEvent[]) {
    return events.map((event) => ({
      id: event.data.user.userId,
      name: event.data.user.name,
      age: event.data.user.age,
      gender: event.data.user.gender,
    }));
  }

  private getUserLocationDataForCreation(events: FacebookEvent[]) {
    return events.map((event) => ({
      country: event.data.user.location.country,
      city: event.data.user.location.city,
      userId: event.data.user.userId,
    }));
  }

  private getEngagementsDataForCreation(events: FacebookEvent[]) {
    return events.map((event) => ({
      actionTime: event.data.engagement['actionTime'] ?? null,
      referer: event.data.engagement['referrer'] ?? null,
      videoId: event.data.engagement['videoId'] ?? null,
      adId: event.data.engagement['adId'] ?? null,
      campaignId: event.data.engagement['campaignId'] ?? null,
      clickPosition: event.data.engagement['clickPosition'] ?? null,
      device: event.data.engagement['device'] ?? null,
      browser: event.data.engagement['browser'] ?? null,
      purchaseAmount: event.data.engagement['purchaseAmount']
        ? Number(event.data.engagement['purchaseAmount'])
        : null,
      eventId: event.eventId,
    }));
  }
}
