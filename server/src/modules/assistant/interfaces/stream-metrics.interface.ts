export interface StreamMetrics {
  duration: number;
  latency: number;
  tokenCount: number;
  cancelled: boolean;
  completed: boolean;
  startedAt: Date;
  endedAt?: Date;
}
