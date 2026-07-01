import { Retriever, RetrieverMetadata } from '../interfaces/retriever.interface';
import { RetrieverResult, RetrieverItem } from '../types/retriever-result.type';
import { ContextSource } from '../types/context-source.type';
import { v4 as uuid } from 'uuid';

export abstract class BaseRetriever implements Retriever {
  abstract readonly source: ContextSource;
  abstract readonly metadata: RetrieverMetadata;

  abstract retrieve(requestId: string, conversationId: string, userId: string, query: string): Promise<RetrieverResult>;

  protected createItem(
    content: string,
    relevanceScore: number,
    recencyScore: number,
    importanceScore: number,
    metadata?: Record<string, unknown>
  ): RetrieverItem {
    return {
      id: uuid(),
      content,
      source: this.source,
      relevanceScore,
      recencyScore,
      importanceScore,
      createdAt: new Date(),
      metadata,
    };
  }

  protected createEmptyResult(): RetrieverResult {
    return {
      source: this.source,
      items: [],
      totalItems: 0,
      retrievalTimeMs: 0,
    };
  }
}
