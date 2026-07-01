import { RetrieverResult } from '../types/retriever-result.type';
import { ContextSource } from '../types/context-source.type';

export interface RetrieverMetadata {
  name: string;
  version: string;
  priority: number;
  enabled: boolean;
  maxTokens: number;
  supportsQuery: boolean;
  supportsSemantic: boolean;
  supportsFilters: boolean;
}

export interface Retriever {
  readonly source: ContextSource;
  readonly metadata: RetrieverMetadata;

  retrieve(requestId: string, conversationId: string, userId: string, query: string): Promise<RetrieverResult>;
}
