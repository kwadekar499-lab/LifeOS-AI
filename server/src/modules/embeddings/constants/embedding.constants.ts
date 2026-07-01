export const EMBEDDING_EVENTS = {
  STARTED: 'embedding.started',
  COMPLETED: 'embedding.completed',
  FAILED: 'embedding.failed',
  BATCH_STARTED: 'batch.started',
  BATCH_COMPLETED: 'batch.completed',
  BATCH_FAILED: 'batch.failed',
} as const;

export const DEFAULT_BATCH_SIZE = 10;
export const DEFAULT_TIMEOUT_MS = 30000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
export const STUDENT_MODE_COST = 0;
export const EMBEDDINGS_ROUTE = 'embeddings';
