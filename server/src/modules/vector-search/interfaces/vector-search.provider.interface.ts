export interface VectorSearchProviderInfo {
  name: string;
  healthy: boolean;
  embeddingModel: string;
  embeddingDimensions: number;
}

export interface SearchOptions {
  topK: number;
  threshold: number;
  filters?: Record<string, unknown>;
}

export interface SearchFilters {
  userId: string;
  provider?: string;
  fileIds?: string[];
  documentIds?: string[];
}

export interface ISimilarityResult {
  chunkId: string;
  content: string;
  score: number;
  fileId: string;
  chunkIndex: number;
  provider: string;
  embeddingModel: string;
  embeddingDimensions: number;
  metadata: Record<string, unknown>;
}

export interface IVectorSearchProvider {
  search(queryEmbedding: number[], options: SearchOptions): Promise<ISimilarityResult[]>;
  searchBatch(queryEmbeddings: number[][], options: SearchOptions): Promise<ISimilarityResult[][]>;
  health(): Promise<boolean>;
  metadata(): VectorSearchProviderInfo;
}
