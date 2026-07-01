export interface EmbeddingMetadata {
  provider: string;
  model: string;
  dimensions: number;
  latency: number;
  tokenCount: number | null;
  costEstimate: number;
}

export interface EmbeddingResult {
  embedding: number[];
  metadata: EmbeddingMetadata;
}

export interface ProviderInfo {
  name: string;
  model: string;
  dimensions: number;
  healthy: boolean;
}

export interface IEmbeddingProvider {
  embedText(text: string): Promise<EmbeddingResult>;
  embedBatch(texts: string[]): Promise<EmbeddingResult[]>;
  health(): Promise<boolean>;
  dimensions(): number;
  metadata(): ProviderInfo;
}
