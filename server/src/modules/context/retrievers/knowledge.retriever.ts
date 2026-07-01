import { Injectable } from '@nestjs/common';
import { BaseRetriever } from './base-retriever';
import { RetrieverResult } from '../types/retriever-result.type';
import { RetrieverMetadata } from '../interfaces/retriever.interface';
import { ContextSource } from '../types/context-source.type';

@Injectable()
export class KnowledgeRetriever extends BaseRetriever {
  readonly source: ContextSource = 'knowledge';
  readonly metadata: RetrieverMetadata = {
    name: 'KnowledgeRetriever',
    version: '1.0.0',
    priority: 15,
    enabled: true,
    maxTokens: 800,
    supportsQuery: false,
    supportsSemantic: false,
    supportsFilters: false,
  };

  async retrieve(
    _requestId: string,
    _conversationId: string,
    _userId: string,
    _query: string
  ): Promise<RetrieverResult> {
    const startTime = Date.now();

    const items = [
      this.createItem(
        'NestJS best practices: Use dependency injection, modular architecture, and guard-based authentication.',
        0.9,
        0.7,
        0.8,
        { knowledgeType: 'technical', domain: 'backend' }
      ),
      this.createItem(
        'React performance optimization: Use React.memo, useMemo, useCallback, and code splitting for better performance.',
        0.7,
        0.5,
        0.75,
        { knowledgeType: 'technical', domain: 'frontend' }
      ),
      this.createItem(
        'TypeScript strict mode: Enables strictNullChecks, noImplicitAny, and other strict type-checking options.',
        0.6,
        0.6,
        0.7,
        { knowledgeType: 'technical', domain: 'typescript' }
      ),
    ];

    const retrievalTimeMs = Date.now() - startTime;

    return {
      source: this.source,
      items,
      totalItems: items.length,
      retrievalTimeMs,
    };
  }
}
