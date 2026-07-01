import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingGateway } from '../gateway/embedding.gateway';
import { EmbeddingRepository } from '../repositories/embedding.repository';
import { EmbeddingEventEmitter } from '../events/embedding-event.emitter';
import { STUDENT_MODE_COST, DEFAULT_BATCH_SIZE } from '../constants/embedding.constants';
import { EmbeddingResult } from '../interfaces/embedding-provider.interface';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  constructor(
    private readonly gateway: EmbeddingGateway,
    private readonly repository: EmbeddingRepository,
    private readonly events: EmbeddingEventEmitter
  ) {}

  async generateForChunk(
    chunkId: string,
    content: string,
    userId: string,
    fileId: string,
    documentId: string
  ): Promise<EmbeddingResult> {
    this.events.emitStarted({ chunkId, fileId, provider: 'gemini', model: 'embedding-001' });
    try {
      const result = await this.gateway.embedText(content);
      await this.repository.create({
        chunkId,
        userId,
        fileId,
        documentId,
        embedding: result.embedding,
        provider: result.metadata.provider,
        model: result.metadata.model,
        dimensions: result.metadata.dimensions,
        tokenCount: result.metadata.tokenCount,
        latencyMs: result.metadata.latency,
        costEstimate: STUDENT_MODE_COST,
      });
      this.events.emitCompleted({
        chunkId,
        fileId,
        provider: result.metadata.provider,
        model: result.metadata.model,
        dimensions: result.metadata.dimensions,
        latency: result.metadata.latency,
        tokenCount: result.metadata.tokenCount ?? undefined,
        duration: result.metadata.latency,
      });
      return result;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.events.emitFailed({ chunkId, fileId, provider: 'gemini', model: 'embedding-001', error: msg });
      throw error;
    }
  }

  async generateForFile(
    chunks: Array<{ id: string; content: string; documentId: string }>,
    userId: string,
    fileId: string
  ): Promise<EmbeddingResult[]> {
    const batchSize = DEFAULT_BATCH_SIZE;
    this.events.emitBatchStarted({
      chunkId: '',
      fileId,
      provider: 'gemini',
      model: 'embedding-001',
      batchSize: chunks.length,
    });
    const results: EmbeddingResult[] = [];
    try {
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const texts = batch.map((c) => c.content);
        const batchResults = await this.gateway.embedBatch(texts, batchSize);
        for (let j = 0; j < batch.length; j++) {
          const chunk = batch[j];
          const result = batchResults[j] || batchResults[0];
          await this.repository.create({
            chunkId: chunk.id,
            userId,
            fileId,
            documentId: chunk.documentId,
            embedding: result.embedding,
            provider: result.metadata.provider,
            model: result.metadata.model,
            dimensions: result.metadata.dimensions,
            tokenCount: result.metadata.tokenCount,
            latencyMs: result.metadata.latency,
            costEstimate: STUDENT_MODE_COST,
          });
          results.push(result);
        }
      }
      this.events.emitBatchCompleted({
        chunkId: '',
        fileId,
        provider: 'gemini',
        model: 'embedding-001',
        batchSize: chunks.length,
      });
      return results;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.events.emitBatchFailed({ chunkId: '', fileId, provider: 'gemini', model: 'embedding-001', error: msg });
      throw error;
    }
  }

  async findByFile(fileId: string) {
    return this.repository.findByFile(fileId);
  }

  async getProviders() {
    const info = this.gateway.getProviderInfo();
    const healthy = await this.gateway.health();
    return info ? [{ ...info, healthy }] : [];
  }
}
