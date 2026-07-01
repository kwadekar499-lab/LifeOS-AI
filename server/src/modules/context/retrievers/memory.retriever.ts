import { Inject, Injectable } from '@nestjs/common';
import { BaseRetriever } from './base-retriever';
import { RetrieverResult, RetrieverItem } from '../types/retriever-result.type';
import { RetrieverMetadata } from '../interfaces/retriever.interface';
import { ContextSource } from '../types/context-source.type';
import { MemoryService } from '../../memory/services/memory.service';

@Injectable()
export class MemoryRetriever extends BaseRetriever {
  readonly source: ContextSource = 'memory';
  readonly metadata: RetrieverMetadata = {
    name: 'MemoryRetriever',
    version: '1.0.0',
    priority: 20,
    enabled: true,
    maxTokens: 1000,
    supportsQuery: true,
    supportsSemantic: false,
    supportsFilters: true,
  };

  constructor(@Inject(MemoryService) private readonly memoryService: MemoryService) {
    super();
  }

  async retrieve(requestId: string, conversationId: string, userId: string, query: string): Promise<RetrieverResult> {
    const startTime = Date.now();

    const memories = await this.memoryService.findRelevant(userId, query, 10);

    const items: RetrieverItem[] = memories.map((memory) => {
      const meta = (memory.metadata as Record<string, unknown>) ?? {};
      return {
        id: memory.id,
        content: memory.content,
        source: this.source,
        relevanceScore: memory.importance / 10,
        recencyScore: this.calculateRecencyScore(memory.createdAt),
        importanceScore: memory.importance,
        createdAt: memory.createdAt,
        metadata: {
          title: (meta as any).title ?? 'memory',
          category: (meta as any).category ?? 'general',
          tags: (meta as any).tags ?? [],
          source: (meta as any).source ?? 'user',
        },
      };
    });

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
}
