import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { EXECUTION_LATENCY } from './constance/metrics-name';
import { Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly timesMap = new Map<string, Function>();

  constructor(
    @InjectMetric(EXECUTION_LATENCY) private readonly histogram: Histogram
  ) {}

  startCounting(category: string, timerId: string) {
    const endTimer = this.histogram.startTimer({ category });
    this.timesMap.set(timerId, endTimer);
  }

  stopCounting(timerId: string) {
    const endTimer = this.timesMap.get(timerId);
    endTimer();
  }
}
