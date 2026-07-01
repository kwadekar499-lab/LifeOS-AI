import { Injectable, Logger } from '@nestjs/common';
import { VectorSearchGateway } from '../gateway/vector-search.gateway';
import { VectorSearchRepository } from '../repositories/vector-search.repository';
import { VectorSearchEventEmitter } from '../events/vector-search-event.emitter';
import { ISimilarityResult, SearchOptions } from '../interfaces/vector-search.provider.interface';
import { SearchFilters } from '../types/search-result.type';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VectorSearchService {
  private readonly logger = new Logger(VectorSearchService.name);

  constructor(
    private gateway: VectorSearchGateway,
    private repository: VectorSearchRepository,
    private events: VectorSearchEventEmitter
  ) {}

  async search(
    query: string,
    userId: string,
    options: {
      topK?: number;
      threshold?: number;
      filters?: SearchFilters;
    } = {}
  ): Promise<ISimilarityResult[]> {
    const queryId = uuidv4();
    const topK = options.topK ?? 10;
    const threshold = options.threshold ?? 0.7;

    const eventPayload = {
      queryId,
      userId,
      provider: 'local',
      topK,
      query,
      filters: options.filters as unknown as Record<string, unknown>,
    };

    this.events.emitStarted(eventPayload);

    const startTime = Date.now();

    try {
      const queryEmbedding = await this.getQueryEmbedding(query);
      const searchOptions: SearchOptions = {
        topK,
        threshold,
        filters: {
          ...(options.filters || {}),
          userId,
        } as unknown as Record<string, unknown>,
      };

      const results = await this.gateway.search(queryEmbedding, searchOptions);

      const latency = Date.now() - startTime;

      this.events.emitCompleted({
        ...eventPayload,
        duration: latency,
        resultsCount: results.length,
      });

      this.logger.log('Vector search completed', {
        queryId,
        userId,
        provider: 'local',
        topK,
        latency,
        resultsCount: results.length,
      });

      return results;
    } catch (error: unknown) {
      const latency = Date.now() - startTime;
      const message = error instanceof Error ? error.message : String(error);

      this.events.emitFailed({
        ...eventPayload,
        error: message,
        duration: latency,
      });

      this.logger.error('Vector search failed', {
        queryId,
        userId,
        error: message,
        latency,
      });

      throw error;
    }
  }

  async searchBatch(
    queries: Array<{ query: string; userId: string }>,
    options: {
      topK?: number;
      threshold?: number;
      filters?: SearchFilters;
    } = {}
  ): Promise<ISimilarityResult[][]> {
    const queryId = uuidv4();
    const topK = options.topK ?? 10;
    const threshold = options.threshold ?? 0.7;

    this.events.emitStarted({
      queryId,
      userId: queries[0]?.userId || '',
      provider: 'local',
      topK,
      query: `batch:${queries.length}`,
      filters: options.filters as unknown as Record<string, unknown>,
    });

    const startTime = Date.now();

    try {
      const queryEmbeddings: number[][] = [];
      for (const q of queries) {
        const embedding = await this.getQueryEmbedding(q.query);
        queryEmbeddings.push(embedding);
      }

      const searchOptions: SearchOptions = {
        topK,
        threshold,
        filters: (options.filters || {}) as unknown as Record<string, unknown>,
      };

      const results = await this.gateway.searchBatch(queryEmbeddings, searchOptions);

      const latency = Date.now() - startTime;

      this.events.emitBatchCompleted({
        queryId,
        userId: queries[0]?.userId || '',
        provider: 'local',
        topK,
        query: `batch:${queries.length}`,
        duration: latency,
        resultsCount: results.reduce((sum, r) => sum + r.length, 0),
      });

      this.logger.log('Batch vector search completed', {
        queryId,
        queriesCount: queries.length,
        latency,
        totalResults: results.reduce((sum, r) => sum + r.length, 0),
      });

      return results;
    } catch (error: unknown) {
      const latency = Date.now() - startTime;
      const message = error instanceof Error ? error.message : String(error);

      this.events.emitBatchFailed({
        queryId,
        userId: queries[0]?.userId || '',
        provider: 'local',
        topK,
        query: `batch:${queries.length}`,
        error: message,
        duration: latency,
      });

      this.logger.error('Batch vector search failed', {
        queryId,
        error: message,
        latency,
      });

      throw error;
    }
  }

  async getProviders() {
    return this.gateway.getProviders();
  }

  async health() {
    return this.gateway.health();
  }

  private async getQueryEmbedding(query: string): Promise<number[]> {
    const gateway = this.gateway as unknown as {
      embedText?: (text: string) => Promise<{ embedding: number[] }>;
    };

    if (gateway.embedText) {
      try {
        const result = await gateway.embedText(query);
        return result.embedding;
      } catch (error) {
        this.logger.warn('Failed to get embedding from gateway, using mock', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const dimensions = 768;
    const embedding: number[] = [];
    let sum = 0;
    for (let i = 0; i < dimensions; i++) {
      const val = Math.random() * 2 - 1;
      embedding.push(val);
      sum += val * val;
    }
    const norm = Math.sqrt(sum);
    for (let i = 0; i < dimensions; i++) {
      embedding[i] /= norm;
    }
    return embedding;
  }
}
