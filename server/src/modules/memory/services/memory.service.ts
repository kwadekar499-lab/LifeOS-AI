import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Memory } from '@prisma/client';
import { MemoryRepository } from '../repositories/memory.repository';
import { MemoryEventEmitter } from '../events/memory-event-emitter.service';
import { CreateMemoryDto } from '../dto/create-memory.dto';
import { UpdateMemoryDto } from '../dto/update-memory.dto';
import { SearchMemoryDto } from '../dto/search-memory.dto';
import { PaginatedResult } from '../types/pagination.type';
import { MEMORY_RANKING_WEIGHTS } from '../constants/defaults';

@Injectable()
export class MemoryService {
  private readonly logger = new Logger(MemoryService.name);

  constructor(
    private readonly memoryRepository: MemoryRepository,
    private readonly eventEmitter: MemoryEventEmitter
  ) {}

  async create(userId: string, dto: CreateMemoryDto): Promise<Memory> {
    const memory = await this.memoryRepository.create(userId, {
      title: dto.title,
      content: dto.content,
      category: dto.category,
      importance: dto.importance,
      tags: dto.tags,
      source: dto.source,
      metadata: dto.metadata,
    });

    this.eventEmitter.emitCreated(memory.id, userId, { category: dto.category });
    this.logger.log({ userId, memoryId: memory.id, action: 'memory.created' });

    return memory;
  }

  async findById(id: string, userId: string): Promise<Memory> {
    const memory = await this.memoryRepository.findById(id, userId);
    if (!memory) {
      throw new NotFoundException('Memory not found');
    }
    return memory;
  }

  async list(userId: string, category?: string, cursor?: string, limit?: number): Promise<PaginatedResult<Memory>> {
    return this.memoryRepository.list(userId, { category, cursor, limit });
  }

  async search(userId: string, dto: SearchMemoryDto): Promise<PaginatedResult<Memory>> {
    const result = await this.memoryRepository.search(userId, {
      query: dto.q,
      category: dto.category,
      tags: dto.tags,
      importanceMin: dto.importanceMin,
      importanceMax: dto.importanceMax,
      cursor: dto.cursor,
      limit: dto.limit,
    });

    this.logger.log({ userId, query: dto.q, resultCount: result.data.length, action: 'memory.search' });
    return result;
  }

  async update(id: string, userId: string, dto: UpdateMemoryDto): Promise<Memory> {
    const memory = await this.memoryRepository.update(id, userId, {
      title: dto.title,
      content: dto.content,
      category: dto.category,
      importance: dto.importance,
      tags: dto.tags,
      source: dto.source,
      metadata: dto.metadata,
    });

    this.eventEmitter.emitUpdated(memory.id, userId);
    this.logger.log({ userId, memoryId: memory.id, action: 'memory.updated' });

    return memory;
  }

  async softDelete(id: string, userId: string): Promise<Memory> {
    const memory = await this.memoryRepository.softDelete(id, userId);

    this.eventEmitter.emitDeleted(memory.id, userId);
    this.logger.log({ userId, memoryId: memory.id, action: 'memory.deleted' });

    return memory;
  }

  async restore(id: string, userId: string): Promise<Memory> {
    const memory = await this.memoryRepository.restore(id, userId);

    this.eventEmitter.emitRestored(memory.id, userId);
    this.logger.log({ userId, memoryId: memory.id, action: 'memory.restored' });

    return memory;
  }

  async findRelevant(userId: string, query: string, limit?: number): Promise<Memory[]> {
    const memories = await this.memoryRepository.findRelevant(userId, { query, limit });

    const ranked = this.rankMemories(memories, query);
    this.logger.log({ userId, query, resultCount: ranked.length, action: 'memory.findRelevant' });

    return ranked;
  }

  estimateTokens(content: string): number {
    return Math.ceil(content.length / 4);
  }

  private rankMemories(memories: Memory[], query: string): Memory[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(Boolean);

    return [...memories].sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, queryLower, queryWords);
      const scoreB = this.calculateRelevanceScore(b, queryLower, queryWords);
      return scoreB - scoreA;
    });
  }

  private calculateRelevanceScore(memory: Memory, queryLower: string, queryWords: string[]): number {
    const importanceScore = (memory.importance - 1) / 9;

    const keywordMatches = this.countKeywordMatches(memory, queryLower, queryWords);
    const maxPossibleMatches = queryWords.length + 1;
    const keywordScore = keywordMatches / maxPossibleMatches;

    const ageMs = Date.now() - memory.createdAt.getTime();
    const maxAgeMs = 365 * 24 * 60 * 60 * 1000;
    const recencyScore = Math.max(0, 1 - ageMs / maxAgeMs);

    return (
      importanceScore * MEMORY_RANKING_WEIGHTS.IMPORTANCE +
      keywordScore * MEMORY_RANKING_WEIGHTS.KEYWORD_MATCH +
      recencyScore * MEMORY_RANKING_WEIGHTS.RECENCY
    );
  }

  private countKeywordMatches(memory: Memory, queryLower: string, queryWords: string[]): number {
    let matches = 0;

    if (memory.title.toLowerCase().includes(queryLower)) matches += 1;
    if (memory.content.toLowerCase().includes(queryLower)) matches += 1;
    if (memory.category.toLowerCase().includes(queryLower)) matches += 1;

    for (const word of queryWords) {
      if (memory.tags.some((tag) => tag.toLowerCase().includes(word))) matches += 1;
    }

    return matches;
  }
}
