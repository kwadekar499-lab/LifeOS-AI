import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { JournalEntry } from '@prisma/client';
import type { JournalRepository as JournalRepositoryIface } from '../interfaces/journal-repository.interface';
import type { PaginatedResult } from '../types/pagination.type';
import { JOURNAL_DEFAULTS } from '../constants/defaults';

@Injectable()
export class JournalRepository implements JournalRepositoryIface {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
    return this.prisma.journalEntry.create({
      data: {
        userId,
        title: data.title,
        content: data.content ?? '',
        summary: data.summary,
        mood: data.mood,
        tags: data.tags ?? [],
        entryDate: data.entryDate ? new Date(data.entryDate) : new Date(),
        metadata: (data.metadata ?? {}) as any,
      },
    });
  }

  async findById(id: string, userId: string): Promise<JournalEntry | null> {
    return this.prisma.journalEntry.findFirst({
      where: { id, userId, deletedAt: null },
    });
  }

  async list(userId: string, options?: { cursor?: string; limit?: number }): Promise<PaginatedResult<JournalEntry>> {
    const limit = this.getLimit(options?.limit);
    const cursor = options?.cursor;

    const entries = await this.prisma.journalEntry.findMany({
      where: { userId, deletedAt: null },
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    return this.formatPaginatedResult(entries, limit);
  }

  async search(
    userId: string,
    query: string,
    options?: { tags?: string[]; cursor?: string; limit?: number }
  ): Promise<PaginatedResult<JournalEntry>> {
    const limit = this.getLimit(options?.limit);
    const cursor = options?.cursor;
    const queryLower = query.toLowerCase();

    const where: Record<string, unknown> = {
      userId,
      deletedAt: null,
      OR: [
        { title: { contains: queryLower, mode: 'insensitive' } },
        { content: { contains: queryLower, mode: 'insensitive' } },
        { summary: { contains: queryLower, mode: 'insensitive' } },
      ],
    };

    if (options?.tags && options.tags.length > 0) {
      where.tags = { hasSome: options.tags };
    }

    const entries = await this.prisma.journalEntry.findMany({
      where: where as any,
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    return this.formatPaginatedResult(entries, limit);
  }

  async update(id: string, userId: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
    await this.ensureOwnership(id, userId);
    return this.prisma.journalEntry.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.summary !== undefined && { summary: data.summary }),
        ...(data.mood !== undefined && { mood: data.mood }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.entryDate !== undefined && { entryDate: new Date(data.entryDate) }),
        ...(data.metadata !== undefined && { metadata: data.metadata as any }),
      },
    });
  }

  async softDelete(id: string, userId: string): Promise<JournalEntry> {
    await this.ensureOwnership(id, userId);
    return this.prisma.journalEntry.update({
      where: { id },
      data: { deletedAt: new Date() } as any,
    });
  }

  async restore(id: string, userId: string): Promise<JournalEntry> {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id, userId, deletedAt: { not: null } },
    });

    if (!entry) {
      throw new NotFoundException('Deleted journal entry not found');
    }

    return this.prisma.journalEntry.update({
      where: { id },
      data: { deletedAt: null } as any,
    });
  }

  async findRelevant(userId: string, query: string, limit?: number): Promise<JournalEntry[]> {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(Boolean);

    const entries = await this.prisma.journalEntry.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { title: { contains: queryLower, mode: 'insensitive' } },
          { content: { contains: queryLower, mode: 'insensitive' } },
          { summary: { contains: queryLower, mode: 'insensitive' } },
          { tags: { hasSome: queryWords } },
        ],
      },
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
      take: limit ?? JOURNAL_DEFAULTS.LIMIT,
    });

    return entries;
  }

  async findByDate(userId: string, date: Date): Promise<JournalEntry[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.journalEntry.findMany({
      where: {
        userId,
        deletedAt: null,
        entryDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findRange(userId: string, startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    return this.prisma.journalEntry.findMany({
      where: {
        userId,
        deletedAt: null,
        entryDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
    });
  }

  private async ensureOwnership(id: string, userId: string): Promise<void> {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }
  }

  private getLimit(limit?: number): number {
    if (!limit || limit < 1) return JOURNAL_DEFAULTS.LIMIT;
    return Math.min(limit, 100);
  }

  private formatPaginatedResult<T extends { id: string }>(items: T[], limit: number): PaginatedResult<T> {
    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;

    return {
      data,
      total: data.length,
      limit,
      cursor: nextCursor ?? undefined,
      hasMore,
    };
  }
}
