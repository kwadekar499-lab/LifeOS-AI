export interface RAGMetrics {
  retrievedItems: number;
  semanticItems: number;
  duplicatesRemoved: number;
  budgetRemoved: number;
  tokenUsage: number;
  retrievalLatencyMs: number;
  provider: string;
  embeddingProvider?: string;
}
