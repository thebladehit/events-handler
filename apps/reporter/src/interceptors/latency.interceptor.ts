import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class LatencyInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const category = handler.name;

    const timerId = `${Math.random()}:${Date.now()}`;
    this.metricsService.startCounting(category, timerId);

    return next.handle().pipe(
      tap(() => {
        this.metricsService.stopCounting(timerId);
      })
    );
  }
}
