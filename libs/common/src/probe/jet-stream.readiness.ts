import { Inject, Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { NatsConnection } from 'nats';
import { NATS_CONNECTION } from '@app/common/jet-streams/nats';

@Injectable()
export class JetStreamReadiness extends HealthIndicator {
  constructor(@Inject(NATS_CONNECTION) private readonly nats: NatsConnection) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.nats.flush();
      return this.getStatus('nats', true);
    } catch (e) {
      throw new HealthCheckError(
        'NATS check failed',
        this.getStatus('nats', false)
      );
    }
  }
}
