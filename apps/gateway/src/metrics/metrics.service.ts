import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import {
  ACCEPTED_EVENTS,
  FAILED_EVENTS,
  PROCESSED_EVENTS,
} from './constance/metrics-name';
import { Counter } from 'prom-client';
import { OnEvent } from '@nestjs/event-emitter';
import { EventProcessing } from '../constance/events-constance';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric(ACCEPTED_EVENTS)
    private readonly accepted_counter: Counter,
    @InjectMetric(PROCESSED_EVENTS)
    private readonly processed_events: Counter,
    @InjectMetric(FAILED_EVENTS)
    private readonly failedEvents: Counter
  ) {}

  @OnEvent(EventProcessing.ACCEPTED_EVENTS)
  handleAccepted(count: number) {
    this.accepted_counter.inc(count);
  }

  @OnEvent(EventProcessing.PROCESSED_EVENTS)
  handleProcessed(count: number) {
    this.processed_events.inc(count);
  }

  @OnEvent(EventProcessing.FAILED_EVENTS)
  handleFailed(count: number) {
    this.failedEvents.inc(count);
  }
}
