import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Knowledge } from '@prisma/client';
import { KnowledgeRepository } from '../repositories/knowledge.repository';
import { KnowledgeEventEmitter } from '../events/knowledge-event-emitter.service';
import { CreateKnowledgeDto, UpdateKnowledgeDto } from '../dto';
import { PaginatedResult } from '../types';
import { KNOWLEDGE_RANKING_WEIGHTS } from '../constants/defaults';

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);

  constructor(
    private readonly knowledgeRepository: KnowledgeRepository,
    private readonly eventEmitter: KnowledgeEventEmitter
  ) {}

  async create(userId: string, dto: CreateKnowledgeDto): Promise<Knowledge> {
    const knowledge = await this.knowledgeRepository.create(userId, {
      title: dto.title,
      content: dto.content,
      summary: dto.summary,
      category: dto.category,
      tags: dto.tags,
      source: dto.source,
      sourceUrl: dto.sourceUrl,
      metadata: dto.metadata,
    });

    this.eventEmitter.emitCreated(knowledge.id, userId, { category: dto.category });
    this.logger.log({ userId, knowledgeId: knowledge.id, action: 'knowledge.created' });

    return knowledge;
  }

  async findById(id: string, userId: string): Promise<Knowledge> {
    const knowledge = await this.knowledgeRepository.findById(id, userId);
    if (!knowledge) {
      throw new NotFoundException('Knowledge not found');
    }
    return knowledge;
  }

  async list(userId: string, category?: string, cursor?: string, limit?: number): Promise<PaginatedResult<Knowledge>> {
    return this.knowledgeRepository.list(userId, { category, cursor, limit });
  }

  async search(
    userId: string,
    query: string,
    category?: string,
    tags?: string[],
    cursor?: string,
    limit?: number
  ): Promise<PaginatedResult<Knowledge>> {
    const result = await this.knowledgeRepository.search(userId, {
      query,
      category,
      tags,
      cursor,
      limit,
    });

    this.logger.log({ userId, query, resultCount: result.data.length, action: 'knowledge.search' });
    return result;
  }

  async update(id: string, userId: string, dto: UpdateKnowledgeDto): Promise<Knowledge> {
    const knowledge = await this.knowledgeRepository.update(id, userId, {
      title: dto.title,
      content: dto.content,
      summary: dto.summary,
      category: dto.category,
      tags: dto.tags,
      source: dto.source,
      sourceUrl: dto.sourceUrl,
      metadata: dto.metadata,
    });

    this.eventEmitter.emitUpdated(knowledge.id, userId);
    this.logger.log({ userId, knowledgeId: knowledge.id, action: 'knowledge.updated' });

    return knowledge;
  }

  async softDelete(id: string, userId: string): Promise<Knowledge> {
    const knowledge = await this.knowledgeRepository.softDelete(id, userId);

    this.eventEmitter.emitDeleted(knowledge.id, userId);
    this.logger.log({ userId, knowledgeId: knowledge.id, action: 'knowledge.deleted' });

    return knowledge;
  }

  async restore(id: string, userId: string): Promise<Knowledge> {
    const knowledge = await this.knowledgeRepository.restore(id, userId);

    this.eventEmitter.emitRestored(knowledge.id, userId);
    this.logger.log({ userId, knowledgeId: knowledge.id, action: 'knowledge.restored' });

    return knowledge;
  }

  async findRelevant(userId: string, query: string, limit?: number): Promise<Knowledge[]> {
    const knowledge = await this.knowledgeRepository.findRelevant(userId, { query, limit });

    const ranked = this.rankKnowledge(knowledge, query);
    this.logger.log({ userId, query, resultCount: ranked.length, action: 'knowledge.findRelevant' });

    return ranked;
  }

  estimateTokens(content: string): number {
    return Math.ceil(content.length / 4);
  }

  private rankKnowledge(knowledge: Knowledge[], query: string): Knowledge[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(Boolean);

    return [...knowledge].sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, queryLower, queryWords);
      const scoreB = this.calculateRelevanceScore(b, queryLower, queryWords);
      return scoreB - scoreA;
    });
  }

  private calculateRelevanceScore(item: Knowledge, queryLower: string, queryWords: string[]): number {
    const keywordMatches = this.countKeywordMatches(item, queryLower, queryWords);
    const maxPossibleMatches = queryWords.length + 4;
    const keywordScore = keywordMatches / maxPossibleMatches;

    const ageMs = Date.now() - item.createdAt.getTime();
    const maxAgeMs = 365 * 24 * 60 * 60 * 1000;
    const recencyScore = Math.max(0, 1 - ageMs / maxAgeMs);

    const metadataScore = this.extractImportanceScore((item.metadata as any) || {});

    return (
      keywordScore * KNOWLEDGE_RANKING_WEIGHTS.KEYWORD_MATCH +
      recencyScore * KNOWLEDGE_RANKING_WEIGHTS.RECENCY +
      metadataScore * KNOWLEDGE_RANKING_WEIGHTS.IMPORTANCE
    );
  }

  private countKeywordMatches(item: Knowledge, queryLower: string, queryWords: string[]): number {
    let matches = 0;

    if (item.title.toLowerCase().includes(queryLower)) matches += 1;
    if (item.content.toLowerCase().includes(queryLower)) matches += 1;

    for (const word of queryWords) {
      if (item.source?.toLowerCase().includes(word)) matches += 1;
    }

    return matches;
  }

  private extractImportanceScore(metadata: Record<string, unknown> | null | undefined): number {
    if (!metadata) {
      return 0;
    }
    const importance = metadata['importance'] as number | undefined;
    if (typeof importance === 'number') {
      return Math.min(1, Math.max(0, (importance - 1) / 9));
    }
    return 0;
  }
}
