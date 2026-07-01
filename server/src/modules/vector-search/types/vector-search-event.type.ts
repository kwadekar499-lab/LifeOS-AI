export enum VectorSearchEventType {
  SEARCH_STARTED = 'search.started',
  SEARCH_COMPLETED = 'search.completed',
  SEARCH_FAILED = 'search.failed',
  BATCH_STARTED = 'search.batch.started',
  BATCH_COMPLETED = 'search.batch.completed',
  BATCH_FAILED = 'search.batch.failed',
}

export interface VectorSearchEventPayload {
  queryId: string;
  userId: string;
  provider: string;
  topK: number;
  query: string;
  filters?: Record<string, unknown>;
  duration?: number;
  resultsCount?: number;
  error?: string;
}
