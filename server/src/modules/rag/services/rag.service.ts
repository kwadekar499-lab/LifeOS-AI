import { Injectable, Logger } from '@nestjs/common';
import { RagQueryDto } from '../dto/rag-query.dto';
import { RagValidator } from '../validators/rag.validator';
import { MergeStrategyService } from '../merging/merge-strategy.service';
import { RAGEventEmitter } from '../events/rag-event.emitter';
import { RAGMetrics } from '../types/rag-metrics.type';

@Injectable()
export class RAGService {
  private readonly logger = new Logger(RAGService.name);

  constructor(
    private readonly validator: RagValidator,
    private readonly mergeService: MergeStrategyService,
    private readonly eventEmitter: RAGEventEmitter
  ) {}

  async query(dto: RagQueryDto, userId: string): Promise<{ answer: string; metrics: RAGMetrics }> {
    const requestId = this.generateRequestId();
    const validation = this.validator.validateQuery(dto);

    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    const { maxItems, provider } = this.validator.resolveDefaults(dto);

    this.eventEmitter.emitStarted({
      requestId,
      query: dto.query,
      userId,
      provider,
    });

    const retrievalStart = Date.now();

    const simulatedItems = [
      {
        id: '1',
        content: 'Simulated context item 1',
        source: 'semantic',
        relevanceScore: 0.9,
        recencyScore: 0.8,
        importanceScore: 0.9,
        createdAt: new Date(),
      },
      {
        id: '2',
        content: 'Simulated context item 2',
        source: 'memory',
        relevanceScore: 0.8,
        recencyScore: 0.7,
        importanceScore: 0.8,
        createdAt: new Date(),
      },
      {
        id: '3',
        content: 'Simulated context item 3',
        source: 'knowledge',
        relevanceScore: 0.85,
        recencyScore: 0.75,
        importanceScore: 0.85,
        createdAt: new Date(),
      },
    ] as any;

    const semanticItems = simulatedItems.filter((item: any) => item.source === 'semantic').length;

    const { merged, duplicatesRemoved } = this.mergeService.merge(simulatedItems);
    const budgetRemoved = Math.max(0, merged.length - maxItems);
    const budgeted = merged.slice(0, maxItems);

    const retrievalLatencyMs = Date.now() - retrievalStart;
    const tokenUsage = budgeted.reduce((sum: number, item: any) => sum + Math.ceil(item.content.length / 4), 0);

    const metrics: RAGMetrics = {
      retrievedItems: simulatedItems.length,
      semanticItems,
      duplicatesRemoved,
      budgetRemoved,
      tokenUsage,
      retrievalLatencyMs,
      provider,
    };

    this.eventEmitter.emitCompleted({
      requestId,
      userId,
      retrievalTimeMs: retrievalLatencyMs,
      retrievedItems: metrics.retrievedItems,
      semanticItems,
      duplicatesRemoved,
      budgetRemoved,
      tokenUsage,
      provider,
    });

    return {
      answer: `RAG response for: ${dto.query}`,
      metrics,
    };
  }

  private generateRequestId(): string {
    return `rag-req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
