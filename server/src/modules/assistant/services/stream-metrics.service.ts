import { Injectable, Logger } from '@nestjs/common';
import { StreamMetrics } from '../interfaces/stream-metrics.interface';

@Injectable()
export class StreamMetricsService {
  private readonly logger = new Logger(StreamMetricsService.name);
  private readonly metrics: Map<string, StreamMetrics> = new Map();

  start(streamId: string): void {
    const metrics: StreamMetrics = {
      duration: 0,
      latency: 0,
      tokenCount: 0,
      cancelled: false,
      completed: false,
      startedAt: new Date(),
    };

    this.metrics.set(streamId, metrics);
    this.logger.debug(`Started tracking metrics for stream: ${streamId}`);
  }

  recordToken(streamId: string): void {
    const metrics = this.metrics.get(streamId);
    if (metrics) {
      metrics.tokenCount++;
      metrics.latency = Date.now() - metrics.startedAt.getTime();
    }
  }

  complete(streamId: string): StreamMetrics | undefined {
    const metrics = this.metrics.get(streamId);
    if (metrics) {
      metrics.completed = true;
      metrics.endedAt = new Date();
      metrics.duration = metrics.endedAt.getTime() - metrics.startedAt.getTime();
      this.logger.debug(
        `Stream completed: ${streamId}, duration: ${metrics.duration}ms, tokens: ${metrics.tokenCount}`
      );
    }
    return metrics;
  }

  cancel(streamId: string): StreamMetrics | undefined {
    const metrics = this.metrics.get(streamId);
    if (metrics) {
      metrics.cancelled = true;
      metrics.endedAt = new Date();
      metrics.duration = metrics.endedAt.getTime() - metrics.startedAt.getTime();
      this.logger.debug(`Stream cancelled: ${streamId}, duration: ${metrics.duration}ms`);
    }
    return metrics;
  }

  getMetrics(streamId: string): StreamMetrics | undefined {
    return this.metrics.get(streamId);
  }

  cleanup(streamId: string): void {
    this.metrics.delete(streamId);
    this.logger.debug(`Cleaned up metrics for stream: ${streamId}`);
  }
}
