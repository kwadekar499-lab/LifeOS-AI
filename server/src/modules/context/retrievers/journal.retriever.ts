import { Inject, Injectable } from '@nestjs/common';
import { BaseRetriever } from './base-retriever';
import { RetrieverResult, RetrieverItem } from '../types/retriever-result.type';
import { RetrieverMetadata } from '../interfaces/retriever.interface';
import { ContextSource } from '../types/context-source.type';
import { JournalService } from '../../journal/services/journal.service';

@Injectable()
export class JournalRetriever extends BaseRetriever {
  readonly source: ContextSource = 'journal';
  readonly metadata: RetrieverMetadata = {
    name: 'JournalRetriever',
    version: '1.0.0',
    priority: 25,
    enabled: true,
    maxTokens: 600,
    supportsQuery: true,
    supportsSemantic: false,
    supportsFilters: true,
  };

  constructor(@Inject(JournalService) private readonly journalService: JournalService) {
    super();
  }

  async retrieve(requestId: string, conversationId: string, userId: string, query: string): Promise<RetrieverResult> {
    const startTime = Date.now();

    const entries = await this.journalService.findRelevant(userId, query, 10);

    const items: RetrieverItem[] = entries.map((entry: any) => ({
      id: entry.id,
      content: entry.content,
      source: this.source,
      relevanceScore: 0.8,
      recencyScore: this.calculateRecencyScore(entry.createdAt),
      importanceScore: 0.7,
      createdAt: entry.createdAt,
      metadata: {
        title: entry.title,
        mood: entry.mood,
        tags: entry.tags,
        entryDate: entry.createdAt,
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

  private calculateRecencyScore(date: Date): number {
    const ageMs = Date.now() - date.getTime();
    const maxAgeMs = 365 * 24 * 60 * 60 * 1000;
    return Math.max(0, 1 - ageMs / maxAgeMs);
  }
}
