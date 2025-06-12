import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { PrismaReadiness } from '@app/common/probe';

@Controller('readiness')
export class ReadinessController {
  constructor(
    private health: HealthCheckService,
    private prismaIndicator: PrismaReadiness,
  ) {}

  @Get()
  @HealthCheck()
  checkReadiness() {
    return this.health.check([
      () => this.prismaIndicator.isHealthy(),
    ]);
  }
}
