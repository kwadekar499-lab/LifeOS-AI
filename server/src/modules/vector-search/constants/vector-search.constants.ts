export const VECTOR_SEARCH_EVENTS = {
  SEARCH_STARTED: 'search.started',
  SEARCH_COMPLETED: 'search.completed',
  SEARCH_FAILED: 'search.failed',
  BATCH_STARTED: 'search.batch.started',
  BATCH_COMPLETED: 'search.batch.completed',
  BATCH_FAILED: 'search.batch.failed',
} as const;

export const DEFAULT_TOP_K = 10;
export const DEFAULT_SIMILARITY_THRESHOLD = 0.7;
export const DEFAULT_TIMEOUT_MS = 30000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;
export const VECTOR_SEARCH_ROUTE = 'vector';
export const STUDENT_MODE_COST = 0;
