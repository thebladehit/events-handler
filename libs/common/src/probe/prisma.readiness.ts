import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { PrismaService } from '@app/common/prisma';

@Injectable()
export class PrismaReadiness extends HealthIndicator {
  constructor(private prisma: PrismaService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return this.getStatus('prisma', true);
    } catch (e) {
      throw new HealthCheckError('Prisma check failed', this.getStatus('prisma', false));
    }
  }
}
