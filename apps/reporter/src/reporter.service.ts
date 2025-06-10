import { Injectable } from '@nestjs/common';
import { EventsReportDto } from './dto/events-report.dto';
import { FacebookRepository, TiktokRepository } from '@app/common/repositories';
import { Source } from '@app/common';

@Injectable()
export class ReporterService {
  constructor(
    private readonly fbRepository: FacebookRepository,
    private readonly tkReporterService: TiktokRepository
  ) {}

  async getEventsCount(dto: EventsReportDto): Promise<{ count: number }> {
    if (dto.source) {
      const count = dto.source === Source.TIKTOK
        ? await this.tkReporterService.getAggregatedEvents(dto)
        : await this.fbRepository.getAggregatedEvents(dto);
      return { count: count._count };
    } else {
      const countFb = await this.fbRepository.getAggregatedEvents(dto);
      const countTtk = await this.tkReporterService.getAggregatedEvents(dto);
      return { count: countTtk._count + countFb._count };
    }
  }
}
