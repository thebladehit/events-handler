import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ReporterService } from './reporter.service';
import { EventsReportDto } from './dto/events-report.dto';
import { EventRevenueDto } from './dto/event-revenue.dto';
import { EventsDemographics } from './dto/events-demographics';
import { LatencyInterceptor } from './interceptors/latency.interceptor';

@Controller('/reports')
@UseInterceptors(LatencyInterceptor)
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

  @Get('/demographics')
  getEventsDemographics(@Query() dto: EventsDemographics) {
    return this.reporterService.getEventsDemographics(dto);
  }
}
