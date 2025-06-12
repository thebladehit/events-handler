import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { EventsReportDto } from './dto/events-report.dto';
import { FacebookRepository, TiktokRepository } from '@app/common/repositories';
import { EventRevenueDto } from './dto/event-revenue.dto';
import { EventsDemographics } from './dto/events-demographics';
import { Source } from '@app/common/types';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ReporterService {
  constructor(
    private readonly fbRepository: FacebookRepository,
    private readonly tkReporterService: TiktokRepository,
    private readonly logger: Logger
  ) {}

  async getEventsCount(dto: EventsReportDto): Promise<{ count: number }> {
    try {
      if (dto.source) {
        return dto.source === Source.TIKTOK
          ? await this.tkReporterService.getAggregatedEvents(dto)
          : await this.fbRepository.getAggregatedEvents(dto);
      } else {
        const countFb = await this.fbRepository.getAggregatedEvents(dto);
        const countTtk = await this.tkReporterService.getAggregatedEvents(dto);
        return { count: countTtk.count + countFb.count };
      }
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getEventsRevenue(dto: EventRevenueDto): Promise<{ revenue: number }> {
    try {
      return dto.source === Source.TIKTOK
        ? await this.tkReporterService.getAggregatedRevenue(dto)
        : await this.fbRepository.getAggregatedRevenue(dto);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getEventsDemographics(
    dto: EventsDemographics
  ): Promise<{ userCount: number }> {
    try {
      return dto.source === Source.TIKTOK
        ? this.tkReporterService.getAggregatedDemographics(dto)
        : this.fbRepository.getAggregatedDemographics(dto);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }

  }
}
