import { Injectable } from '@nestjs/common';
import { BaseRetriever } from '../../context/retrievers/base-retriever';
import { RetrieverResult, RetrieverItem } from '../../context/types/retriever-result.type';
import { RetrieverMetadata } from '../../context/interfaces/retriever.interface';
import { ContextSource } from '../../context/types/context-source.type';
import { KnowledgeService } from '../services/knowledge.service';

@Injectable()
export class KnowledgeRetriever extends BaseRetriever {
  readonly source: ContextSource = 'knowledge';
  readonly metadata: RetrieverMetadata = {
    name: 'KnowledgeRetriever',
    version: '1.0.0',
    priority: 15,
    enabled: true,
    maxTokens: 800,
    supportsQuery: true,
    supportsSemantic: false,
    supportsFilters: true,
  };

  constructor(private readonly knowledgeService: KnowledgeService) {
    super();
  }

  async retrieve(requestId: string, conversationId: string, userId: string, query: string): Promise<RetrieverResult> {
    const startTime = Date.now();

    const knowledge = await this.knowledgeService.findRelevant(userId, query, 10);

    const items: RetrieverItem[] = knowledge.map((item) => ({
      id: item.id,
      content: item.content,
      source: this.source,
      relevanceScore: this.extractImportanceScore((item.metadata as any) || {}),
      recencyScore: this.calculateRecencyScore(item.createdAt),
      importanceScore: this.extractImportanceScore((item.metadata as any) || {}),
      createdAt: item.createdAt,
      metadata: {
        title: item.title,
        category: (item as any).category,
        tags: (item as any).tags,
        source: item.source,
        summary: (item as any).summary,
      },
    }));

    const retrievalTimeMs = Date.now() - startTime;

    return {
      source: this.source,
      items,
      totalItems: items.length,
      retrievalTimeMs,
    };
  }

  private calculateRecencyScore(createdAt: Date): number {
    const ageMs = Date.now() - createdAt.getTime();
    const maxAgeMs = 365 * 24 * 60 * 60 * 1000;
    return Math.max(0, 1 - ageMs / maxAgeMs);
  }

  private extractImportanceScore(metadata: any): number {
    if (!metadata || typeof metadata.importance !== 'number') {
      return 0;
    }
    const importance = metadata.importance;
    return Math.min(1, Math.max(0, (importance - 1) / 9));
  }
}
