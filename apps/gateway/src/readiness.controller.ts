import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { JetStreamReadiness } from '@app/common/probe';

@Controller('readiness')
export class ReadinessController {
  constructor(
    private health: HealthCheckService,
    private natsIndicator: JetStreamReadiness,
  ) {}

  @Get()
  @HealthCheck()
  checkReadiness() {
    return this.health.check([
      () => this.natsIndicator.isHealthy(),
    ]);
  }
}
