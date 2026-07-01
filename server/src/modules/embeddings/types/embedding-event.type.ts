export enum EmbeddingEventType {
  STARTED = 'embedding.started',
  COMPLETED = 'embedding.completed',
  FAILED = 'embedding.failed',
  BATCH_STARTED = 'batch.started',
  BATCH_COMPLETED = 'batch.completed',
  BATCH_FAILED = 'batch.failed',
}

export interface EmbeddingEventPayload {
  chunkId: string;
  fileId?: string;
  provider: string;
  model: string;
  dimensions?: number;
  latency?: number;
  tokenCount?: number;
  duration?: number;
  batchSize?: number;
  error?: string;
}
