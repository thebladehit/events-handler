import { Controller, Get, Query } from '@nestjs/common';
import { ReporterService } from './reporter.service';
import { EventsReportDto } from './dto/events-report.dto';
import { EventRevenueDto } from './dto/event-revenue.dto';

@Controller('/reports')
export class ReporterController {
  constructor(private readonly reporterService: ReporterService) {}

  @Get('/events')
  getEventsCount(@Query() dto: EventsReportDto) {
    return this.reporterService.getEventsCount(dto);
  }

  @Get('/revenue')
  getEventsRevenue(@Query() dto: EventRevenueDto) {
    return this.reporterService.getEventsRevenue(dto);
  }
}
