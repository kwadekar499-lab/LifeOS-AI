import { Injectable, Logger } from '@nestjs/common';
import { RetrieverItem } from '../../context/types/retriever-result.type';
import { RAG_MERGE_PRIORITY } from '../constants/rag.constants';

@Injectable()
export class MergeStrategyService {
  private readonly logger = new Logger(MergeStrategyService.name);

  merge(results: RetrieverItem[]): { merged: RetrieverItem[]; duplicatesRemoved: number } {
    const seen = new Map<string, RetrieverItem>();
    let duplicatesRemoved = 0;

    for (const item of results) {
      const key = `${item.source}:${item.id}`;
      const existing = seen.get(key);

      if (!existing) {
        seen.set(key, item);
      } else {
        duplicatesRemoved++;
      }
    }

    const merged = Array.from(seen.values());
    merged.sort((a, b) => {
      const priorityA = RAG_MERGE_PRIORITY[a.source] ?? 99;
      const priorityB = RAG_MERGE_PRIORITY[b.source] ?? 99;
      return priorityA - priorityB;
    });

    return { merged, duplicatesRemoved };
  }
}
