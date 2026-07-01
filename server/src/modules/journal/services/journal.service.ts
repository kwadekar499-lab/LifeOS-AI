import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { JournalEntry } from '@prisma/client';
import { JournalRepository } from '../repositories/journal.repository';
import { JournalEventEmitter } from '../events/journal-event-emitter.service';
import { CreateJournalDto, UpdateJournalDto } from '../dto';
import { PaginatedResult } from '../types';

@Injectable()
export class JournalService {
  private readonly logger = new Logger(JournalService.name);

  constructor(
    private readonly journalRepository: JournalRepository,
    private readonly eventEmitter: JournalEventEmitter
  ) {}

  async create(userId: string, dto: CreateJournalDto): Promise<JournalEntry> {
    const entry = await this.journalRepository.create(userId, {
      title: dto.title,
      content: dto.content,
      summary: dto.summary,
      mood: dto.mood,
      tags: dto.tags,
      entryDate: dto.entryDate ? new Date(dto.entryDate) : undefined,
      metadata: dto.metadata as any,
    });

    this.eventEmitter.emitCreated(entry.id, userId);
    this.logger.log({ userId, journalId: entry.id, action: 'journal.created' });

    return entry;
  }

  async findById(id: string, userId: string): Promise<JournalEntry> {
    const entry = await this.journalRepository.findById(id, userId);
    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }
    return entry;
  }

  async list(userId: string, cursor?: string, limit?: number): Promise<PaginatedResult<JournalEntry>> {
    return this.journalRepository.list(userId, { cursor, limit });
  }

  async search(
    userId: string,
    query: string,
    tags?: string[],
    cursor?: string,
    limit?: number
  ): Promise<PaginatedResult<JournalEntry>> {
    const result = await this.journalRepository.search(userId, query, { tags, cursor, limit });
    this.logger.log({ userId, query, resultCount: result.data.length, action: 'journal.search' });
    return result;
  }

  async update(id: string, userId: string, dto: UpdateJournalDto): Promise<JournalEntry> {
    const entry = await this.journalRepository.update(id, userId, {
      title: dto.title,
      content: dto.content,
      summary: dto.summary,
      mood: dto.mood,
      tags: dto.tags,
      entryDate: dto.entryDate ? new Date(dto.entryDate) : undefined,
      metadata: dto.metadata as any,
    });

    this.eventEmitter.emitUpdated(entry.id, userId);
    this.logger.log({ userId, journalId: entry.id, action: 'journal.updated' });

    return entry;
  }

  async softDelete(id: string, userId: string): Promise<JournalEntry> {
    const entry = await this.journalRepository.softDelete(id, userId);
    this.eventEmitter.emitDeleted(entry.id, userId);
    this.logger.log({ userId, journalId: entry.id, action: 'journal.deleted' });
    return entry;
  }

  async restore(id: string, userId: string): Promise<JournalEntry> {
    const entry = await this.journalRepository.restore(id, userId);
    this.eventEmitter.emitRestored(entry.id, userId);
    this.logger.log({ userId, journalId: entry.id, action: 'journal.restored' });
    return entry;
  }

  async findRelevant(userId: string, query: string, limit?: number): Promise<JournalEntry[]> {
    const entries = await this.journalRepository.findRelevant(userId, query, limit);
    const ranked = this.rankJournal(entries, query);
    this.logger.log({ userId, query, resultCount: ranked.length, action: 'journal.findRelevant' });
    return ranked;
  }

  async findByDate(userId: string, date: Date): Promise<JournalEntry[]> {
    return this.journalRepository.findByDate(userId, date);
  }

  async findRange(userId: string, startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    return this.journalRepository.findRange(userId, startDate, endDate);
  }

  estimateTokens(content: string): number {
    return Math.ceil(content.length / 4);
  }

  private rankJournal(entries: JournalEntry[], query: string): JournalEntry[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(Boolean);

    return [...entries].sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, queryLower, queryWords);
      const scoreB = this.calculateRelevanceScore(b, queryLower, queryWords);
      return scoreB - scoreA;
    });
  }

  private calculateRelevanceScore(entry: JournalEntry, queryLower: string, queryWords: string[]): number {
    const keywordScore = this.calculateKeywordScore(entry, queryLower, queryWords);
    const recencyScore = this.calculateRecencyScore(entry.entryDate);
    const importanceScore = this.calculateImportanceScore(entry);

    return keywordScore * 0.4 + recencyScore * 0.4 + importanceScore * 0.2;
  }

  private calculateKeywordScore(entry: JournalEntry, queryLower: string, queryWords: string[]): number {
    let matches = 0;
    const title = (entry.title || '').toLowerCase();
    const content = entry.content.toLowerCase();
    const summary = (entry.summary || '').toLowerCase();

    if (title.includes(queryLower)) matches += 2;
    if (content.includes(queryLower)) matches += 1;
    if (summary.includes(queryLower)) matches += 1;

    for (const word of queryWords) {
      if (entry.tags.some((tag) => tag.toLowerCase().includes(word))) matches += 1;
    }

    const maxPossibleMatches = queryWords.length * 2 + 4;
    return Math.min(1, matches / maxPossibleMatches);
  }

  private calculateRecencyScore(entryDate: Date): number {
    const ageMs = Date.now() - entryDate.getTime();
    const maxAgeMs = 365 * 24 * 60 * 60 * 1000;
    return Math.max(0, 1 - ageMs / maxAgeMs);
  }

  private calculateImportanceScore(entry: JournalEntry): number {
    const metadata = (entry.metadata as Record<string, unknown>) || {};
    const importance = metadata['importance'] as number | undefined;
    if (typeof importance === 'number') {
      return Math.min(1, Math.max(0, (importance - 1) / 9));
    }
    return 0.5;
  }
}
