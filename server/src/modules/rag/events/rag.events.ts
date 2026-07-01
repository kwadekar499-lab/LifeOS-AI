export enum RAGEventType {
  STARTED = 'rag.started',
  COMPLETED = 'rag.completed',
  FAILED = 'rag.failed',
  CONTEXT_MERGED = 'context.merged',
  SEMANTIC_SEARCH_COMPLETED = 'semantic.search.completed',
}

export interface RAGStartedPayload {
  requestId: string;
  query: string;
  userId: string;
  provider: string;
}

export interface RAGCompletedPayload {
  requestId: string;
  userId: string;
  retrievalTimeMs: number;
  retrievedItems: number;
  semanticItems: number;
  duplicatesRemoved: number;
  budgetRemoved: number;
  tokenUsage: number;
  provider: string;
  embeddingProvider?: string;
}

export interface RAGFailedPayload {
  requestId: string;
  userId: string;
  query: string;
  error: string;
  provider: string;
}

export interface ContextMergedPayload {
  requestId: string;
  userId: string;
  totalItemsBefore: number;
  totalItemsAfter: number;
  duplicatesRemoved: number;
}

export interface SemanticSearchCompletedPayload {
  requestId: string;
  userId: string;
  query: string;
  hits: number;
  latencyMs: number;
  provider: string;
}
