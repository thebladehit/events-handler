import { Injectable } from '@nestjs/common';
import { EventsReportDto } from './dto/events-report.dto';
import { FacebookRepository, TiktokRepository } from '@app/common/repositories';
import { Source } from '@app/common';
import { EventRevenueDto } from './dto/event-revenue.dto';
import { EventsDemographics } from './dto/events-demographics';

@Injectable()
export class ReporterService {
  constructor(
    private readonly fbRepository: FacebookRepository,
    private readonly tkReporterService: TiktokRepository
  ) {}

  async getEventsCount(dto: EventsReportDto): Promise<{ count: number }> {
    if (dto.source) {
      return dto.source === Source.TIKTOK
        ? await this.tkReporterService.getAggregatedEvents(dto)
        : await this.fbRepository.getAggregatedEvents(dto);
    } else {
      const countFb = await this.fbRepository.getAggregatedEvents(dto);
      const countTtk = await this.tkReporterService.getAggregatedEvents(dto);
      return { count: countTtk.count + countFb.count };
    }
  }

  async getEventsRevenue(dto: EventRevenueDto): Promise<{ revenue: number }> {
    return dto.source === Source.TIKTOK
      ? await this.tkReporterService.getAggregatedRevenue(dto)
      : await this.fbRepository.getAggregatedRevenue(dto);
  }

  async getEventsDemographics(
    dto: EventsDemographics
  ): Promise<{ userCount: number }> {
    return dto.source === Source.TIKTOK
      ? this.tkReporterService.getAggregatedDemographics(dto)
      : this.fbRepository.getAggregatedDemographics(dto);
  }
}
