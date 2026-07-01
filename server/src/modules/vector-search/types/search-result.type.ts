export interface SearchResult {
  chunkId: string;
  chunkContent: string;
  score: number;
  fileId: string;
  chunkIndex: number;
  provider: string;
  similarity: number;
  metadata: Record<string, unknown>;
}

export interface ProviderInfo {
  name: string;
  healthy: boolean;
  embeddingModel: string;
  embeddingDimensions: number;
}

export interface SearchFilters {
  userId: string;
  fileIds?: string[];
  documentIds?: string[];
  knowledgeIds?: string[];
  provider?: string;
  minSimilarity?: number;
}

export interface QueryEmbedding {
  embedding: number[];
  model: string;
  dimensions: number;
  provider: string;
}

export interface SearchLogContext {
  queryId: string;
  userId: string;
  provider: string;
  topK: number;
  latency: number;
  resultsCount: number;
  filters?: SearchFilters;
}
