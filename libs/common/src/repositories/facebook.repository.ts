import {
  EventsAggregationFilters,
  EventsRevenueFilters,
  FacebookEvent,
} from '@app/common';
import { FacebookRepository } from './interfaces';
import { PrismaService } from '@app/common/prisma';
import { Injectable } from '@nestjs/common';
import { FacebookEventType } from '@prisma/client';
import { mapEventToPrismaType } from '@app/common/utils';
import {
  Source as PrismaSource,
  FunnelStage as PrismaFunnelStage,
} from '@prisma/client';

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

  getAggregatedEvents(
    filters: EventsAggregationFilters
  ): Promise<{ _count: number }> {
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

  getAggregatedRevenue(filters: EventsRevenueFilters): Promise<any> {
    return Promise.resolve(undefined);
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
      purchaseAmount: event.data.engagement['purchaseAmount'] ?? null,
      eventId: event.eventId,
    }));
  }
}
