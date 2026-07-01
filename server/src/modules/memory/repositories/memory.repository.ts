import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Memory } from '@prisma/client';
import {
  IMemoryRepository,
  CreateMemoryData,
  UpdateMemoryData,
  SearchMemoryParams,
  ListMemoryParams,
  FindRelevantParams,
} from '../interfaces/memory-repository.interface';
import { PaginatedResult } from '../types/pagination.type';
import { MEMORY_DEFAULTS } from '../constants/defaults';

@Injectable()
export class MemoryRepository implements IMemoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateMemoryData): Promise<Memory> {
    return this.prisma.memory.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        category: data.category ?? MEMORY_DEFAULTS.DEFAULT_CATEGORY,
        importance: data.importance ?? MEMORY_DEFAULTS.DEFAULT_IMPORTANCE,
        tags: data.tags ?? [],
        source: data.source ?? MEMORY_DEFAULTS.DEFAULT_SOURCE,
        metadata: (data.metadata ?? {}) as any,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateMemoryData): Promise<Memory> {
    await this.ensureOwnership(id, userId);
    return this.prisma.memory.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.importance !== undefined && { importance: data.importance }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.source !== undefined && { source: data.source }),
        ...(data.metadata !== undefined && { metadata: data.metadata as any }),
      },
    });
  }

  async softDelete(id: string, userId: string): Promise<Memory> {
    await this.ensureOwnership(id, userId);
    return this.prisma.memory.update({
      where: { id },
      data: { deletedAt: new Date() } as any,
    });
  }

  async restore(id: string, userId: string): Promise<Memory> {
    const memory = await this.prisma.memory.findFirst({
      where: { id, userId, deletedAt: { not: null } },
    });

    if (!memory) {
      throw new NotFoundException('Deleted memory not found');
    }

    return this.prisma.memory.update({
      where: { id },
      data: { deletedAt: null } as any,
    });
  }

  async findById(id: string, userId: string): Promise<Memory | null> {
    return this.prisma.memory.findFirst({
      where: { id, userId, deletedAt: null },
    });
  }

  async search(userId: string, params: SearchMemoryParams): Promise<PaginatedResult<Memory>> {
    const limit = this.getLimit(params.limit);
    const cursor = params.cursor;
    const query = params.query?.trim();

    const where: Record<string, unknown> = {
      userId,
      deletedAt: null,
    };

    if (params.category) {
      where.category = params.category;
    }

    if (params.tags && params.tags.length > 0) {
      where.tags = { hasSome: params.tags };
    }

    if (params.importanceMin !== undefined || params.importanceMax !== undefined) {
      const importanceFilter: Record<string, number> = {};
      if (params.importanceMin !== undefined) importanceFilter.gte = params.importanceMin;
      if (params.importanceMax !== undefined) importanceFilter.lte = params.importanceMax;
      where.importance = importanceFilter;
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
        { category: { contains: query, mode: 'insensitive' } },
      ] as Record<string, unknown>[];
    }

    const memories = await this.prisma.memory.findMany({
      where: where as any,
      orderBy: [{ importance: 'desc' }, { createdAt: 'desc' }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    return this.formatPaginatedResult(memories, limit);
  }

  async list(userId: string, params: ListMemoryParams): Promise<PaginatedResult<Memory>> {
    const limit = this.getLimit(params.limit);
    const cursor = params.cursor;

    const where: Record<string, unknown> = {
      userId,
      deletedAt: null,
    };

    if (params.category) {
      where.category = params.category;
    }

    const memories = await this.prisma.memory.findMany({
      where: where as any,
      orderBy: [{ importance: 'desc' }, { createdAt: 'desc' }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    return this.formatPaginatedResult(memories, limit);
  }

  async findRelevant(userId: string, params: FindRelevantParams): Promise<Memory[]> {
    const limit = params.limit ?? MEMORY_DEFAULTS.DEFAULT_LIMIT;
    const query = params.query.trim();

    if (!query) {
      return this.prisma.memory.findMany({
        where: { userId, deletedAt: null },
        orderBy: [{ importance: 'desc' }, { createdAt: 'desc' }],
        take: limit,
      });
    }

    return this.prisma.memory.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
      orderBy: [{ importance: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
  }

  private async ensureOwnership(id: string, userId: string): Promise<void> {
    const memory = await this.prisma.memory.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!memory) {
      throw new NotFoundException('Memory not found');
    }
  }

  private getLimit(limit?: number): number {
    if (!limit || limit < 1) return MEMORY_DEFAULTS.DEFAULT_LIMIT;
    return Math.min(limit, MEMORY_DEFAULTS.MAX_LIMIT);
  }

  private formatPaginatedResult<T extends { id: string }>(items: T[], limit: number): PaginatedResult<T> {
    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;

    return {
      data,
      nextCursor,
      hasMore,
    };
  }
}
