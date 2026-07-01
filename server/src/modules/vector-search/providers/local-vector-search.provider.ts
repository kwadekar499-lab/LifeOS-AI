import { Injectable, Logger } from '@nestjs/common';
import {
  ISimilarityResult,
  IVectorSearchProvider,
  SearchOptions,
  VectorSearchProviderInfo,
} from '../interfaces/vector-search.provider.interface';
import { VectorSearchRepository } from '../repositories/vector-search.repository';

@Injectable()
export class LocalVectorSearchProvider implements IVectorSearchProvider {
  private readonly logger = new Logger(LocalVectorSearchProvider.name);
  private readonly defaultOptions: SearchOptions = {
    topK: 10,
    threshold: 0.7,
  };

  constructor(private repository: VectorSearchRepository) {}

  async search(queryEmbedding: number[], _options: SearchOptions = this.defaultOptions): Promise<ISimilarityResult[]> {
    const searchOptions = { ...this.defaultOptions, ..._options };

    const _rows = await this.repository.findEmbeddingsForSearch({ userId: '' });

    const scored: ISimilarityResult[] = [];

    for (const row of _rows) {
      const _similarity = this.calculateSimilarity(queryEmbedding, row.embedding);

      if (_similarity >= searchOptions.threshold) {
        scored.push({
          chunkId: row.chunkId,
          content: row.chunk.content,
          score: _similarity,
          fileId: row.fileId,
          chunkIndex: row.chunk.chunkIndex,
          provider: row.provider,
          embeddingModel: row.model,
          embeddingDimensions: row.dimensions,
          metadata: (row.chunk.metadata as Record<string, unknown>) ?? {},
        });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, searchOptions.topK);
  }

  private calculateSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async searchBatch(
    queryEmbeddings: number[][],
    options: SearchOptions = this.defaultOptions
  ): Promise<ISimilarityResult[][]> {
    const results: ISimilarityResult[][] = [];
    for (const embedding of queryEmbeddings) {
      const hits = await this.search(embedding, options);
      results.push(hits);
    }
    return results;
  }

  async health(): Promise<boolean> {
    try {
      await this.repository.findEmbeddingsForSearch({ userId: '' });
      return true;
    } catch {
      return false;
    }
  }

  metadata(): VectorSearchProviderInfo {
    return {
      name: 'local',
      healthy: true,
      embeddingModel: 'unknown',
      embeddingDimensions: 0,
    };
  }
}
