import { Injectable, Logger } from '@nestjs/common';
import { RetrieverResult, RetrieverItem } from '../types/retriever-result.type';
import { RankedContextItem } from '../types/context-object.type';
import { RANKING_WEIGHTS } from '../constants';

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name);

  rank(results: RetrieverResult[]): RankedContextItem[] {
    const allItems: RankedContextItem[] = [];

    for (const result of results) {
      for (const item of result.items) {
        const combinedScore = this.calculateCombinedScore(item);
        allItems.push({ ...item, combinedScore });
      }
    }

    allItems.sort((a, b) => b.combinedScore - a.combinedScore);

    return allItems;
  }

  private calculateCombinedScore(item: RetrieverItem): number {
    const { relevance, recency, importance } = RANKING_WEIGHTS;

    const normalizedRelevance = item.relevanceScore;
    const normalizedRecency = item.recencyScore;
    const normalizedImportance = item.importanceScore;

    return normalizedRelevance * relevance + normalizedRecency * recency + normalizedImportance * importance;
  }
}
