export interface RetrieverItem {
  id: string;
  content: string;
  source: string;
  relevanceScore: number;
  recencyScore: number;
  importanceScore: number;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export interface RetrieverResult {
  source: string;
  items: RetrieverItem[];
  totalItems: number;
  retrievalTimeMs: number;
}
