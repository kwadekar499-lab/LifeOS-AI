import { Injectable, Logger } from '@nestjs/common';
import { ContextRequest } from '../types/context-request.type';
import { ContextObject, ContextMetadata } from '../types/context-object.type';
import { RetrieverResult } from '../types/retriever-result.type';
import { RetrieverRegistry } from '../registry/retriever.registry';
import { RankingService } from '../ranking/ranking.service';
import { BudgetManagerService } from '../budget/budget-manager.service';
import { DEFAULT_TOKEN_BUDGET, ESTIMATED_TOKENS_PER_CHAR } from '../constants';

@Injectable()
export class ContextBuilder {
  private readonly logger = new Logger(ContextBuilder.name);

  constructor(
    private readonly registry: RetrieverRegistry,
    private readonly rankingService: RankingService,
    private readonly budgetManager: BudgetManagerService
  ) {}

  async build(request: ContextRequest): Promise<ContextObject> {
    const startTime = Date.now();
    const { requestId, conversationId } = request;

    // Phase 1: Parallel Retrieval with Timeout & Failure Isolation
    const retrievalStart = Date.now();
    const { results, failedRetrievers, retrievalTimes, itemsPerRetriever, tokensPerRetriever } =
      await this.executeParallelRetrieval(request);
    const retrievalTime = Date.now() - retrievalStart;

    const totalItemsRetrieved = results.reduce((sum, r) => sum + r.totalItems, 0);
    const allSources = results.map((r) => r.source);

    // Phase 2: Deduplication
    const { dedupedResults, duplicatesRemoved } = this.deduplicateResults(results);

    // Phase 3: Global Ranking
    const rankingStart = Date.now();
    const rankedItems = this.rankingService.rank(dedupedResults);
    const rankingTime = Date.now() - rankingStart;

    // Phase 4: Budget Allocation
    const tokenBudget = request.tokenBudget ?? DEFAULT_TOKEN_BUDGET;
    const budgetStart = Date.now();
    const budgetedItems = this.budgetManager.applyBudget(rankedItems, tokenBudget);
    const budgetTime = Date.now() - budgetStart;

    const totalItemsIncluded = budgetedItems.length;
    const estimatedTokens = budgetedItems.reduce(
      (sum, item) => sum + Math.ceil(item.content.length / ESTIMATED_TOKENS_PER_CHAR),
      0
    );

    const metadata: ContextMetadata = {
      retrievalTime,
      rankingTime,
      budgetTime,
      itemsRetrieved: totalItemsRetrieved,
      itemsIncluded: totalItemsIncluded,
      estimatedTokens,
      requestId,
      conversationId,
      retrieversUsed: allSources,
      retrieversFailed: failedRetrievers,
      retrievalTimes,
      tokensPerRetriever,
      itemsPerRetriever,
      duplicatesRemoved,
      totalItems: totalItemsRetrieved,
      buildTime: Date.now() - startTime,
    };

    const context: ContextObject = {
      systemContext: 'LifeOS AI Personal Assistant - Context-Aware Intelligent System',
      conversation: budgetedItems.filter((item) => item.source === 'conversation'),
      relevantMemories: budgetedItems.filter((item) => item.source === 'memory'),
      relevantTasks: budgetedItems.filter((item) => item.source === 'task'),
      relevantKnowledge: budgetedItems.filter((item) => item.source === 'knowledge'),
      relevantJournalEntries: budgetedItems.filter((item) => item.source === 'journal'),
      metadata,
    };

    this.logger.log(
      {
        requestId,
        conversationId,
        retrieversUsed: allSources,
        retrieversFailed: failedRetrievers,
        totalItemsRetrieved,
        totalItemsIncluded,
        estimatedTokens,
        duplicatesRemoved,
        buildTimeMs: metadata.buildTime,
      },
      'Context built successfully'
    );

    return context;
  }

  private async executeParallelRetrieval(request: ContextRequest): Promise<{
    results: RetrieverResult[];
    failedRetrievers: string[];
    retrievalTimes: Record<string, number>;
    itemsPerRetriever: Record<string, number>;
    tokensPerRetriever: Record<string, number>;
  }> {
    const { requestId, conversationId, userId, query, includeSources, excludeSources } = request;

    const registeredRetrievers = this.registry.list();

    const filteredRetrievers = registeredRetrievers.filter((r) => {
      if (!r.metadata.enabled) return false;
      if (includeSources && includeSources.length > 0) {
        return includeSources.includes(r.retriever.source);
      }
      if (excludeSources && excludeSources.length > 0) {
        return !excludeSources.includes(r.retriever.source);
      }
      return true;
    });

    const retrievalPromises = filteredRetrievers.map(async (registered) => {
      const { retriever } = registered;
      const timeoutMs = this.registry.getTimeout(retriever.source);
      const source = retriever.source;

      const startTime = Date.now();

      try {
        const result = await this.executeWithTimeout(
          retriever.retrieve(requestId, conversationId, userId, query),
          timeoutMs
        );

        const elapsed = Date.now() - startTime;

        // Calculate estimated tokens for this retriever
        const tokens = result.items.reduce(
          (sum, item) => sum + Math.ceil(item.content.length / ESTIMATED_TOKENS_PER_CHAR),
          0
        );

        return {
          source,
          result,
          elapsed,
          itemsCount: result.totalItems,
          tokens,
          failed: false,
          failureReason: null,
        };
      } catch (error: any) {
        const elapsed = Date.now() - startTime;
        const errorMessage = error.message ?? 'Unknown error';

        this.logger.warn(
          {
            requestId,
            source,
            elapsed,
            failureReason: errorMessage,
          },
          `Retriever "${source}" failed or timed out`
        );

        return {
          source,
          result: null,
          elapsed,
          itemsCount: 0,
          tokens: 0,
          failed: true,
          failureReason: errorMessage,
        };
      }
    });

    const settledResults = await Promise.allSettled(retrievalPromises);

    const results: RetrieverResult[] = [];
    const failedRetrievers: string[] = [];
    const retrievalTimes: Record<string, number> = {};
    const itemsPerRetriever: Record<string, number> = {};
    const tokensPerRetriever: Record<string, number> = {};

    for (const settled of settledResults) {
      if (settled.status === 'fulfilled') {
        const outcome = settled.value;
        retrievalTimes[outcome.source] = outcome.elapsed;
        itemsPerRetriever[outcome.source] = outcome.itemsCount;
        tokensPerRetriever[outcome.source] = outcome.tokens;

        if (outcome.failed) {
          failedRetrievers.push(outcome.source);
        } else if (outcome.result) {
          results.push(outcome.result);
        }
      }
    }

    return { results, failedRetrievers, retrievalTimes, itemsPerRetriever, tokensPerRetriever };
  }

  private deduplicateResults(results: RetrieverResult[]): {
    dedupedResults: RetrieverResult[];
    duplicatesRemoved: number;
  } {
    const seenIds = new Set<string>();
    let duplicatesRemoved = 0;

    const dedupedResults: RetrieverResult[] = results.map((result) => {
      const dedupedItems = result.items.filter((item) => {
        const key = `${item.source}:${item.id}`;
        if (seenIds.has(key)) {
          duplicatesRemoved++;
          return false;
        }
        seenIds.add(key);
        return true;
      });

      return {
        ...result,
        items: dedupedItems,
        totalItems: dedupedItems.length,
      };
    });

    return { dedupedResults, duplicatesRemoved };
  }

  private async executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    if (timeoutMs <= 0) {
      return promise;
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }
}
