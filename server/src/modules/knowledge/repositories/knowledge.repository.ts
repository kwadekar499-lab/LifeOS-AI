import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Knowledge } from '@prisma/client';
import {
  IKnowledgeRepository,
  CreateKnowledgeData,
  UpdateKnowledgeData,
  SearchKnowledgeParams,
  ListKnowledgeParams,
  FindRelevantParams,
} from '../interfaces/knowledge-repository.interface';
import { PaginatedResult } from '../types';
import { KNOWLEDGE_DEFAULTS } from '../constants/defaults';

@Injectable()
export class KnowledgeRepository implements IKnowledgeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateKnowledgeData): Promise<Knowledge> {
    return this.prisma.knowledge.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        summary: data.summary,
        category: data.category ?? KNOWLEDGE_DEFAULTS.DEFAULT_CATEGORY,
        tags: data.tags ?? [],
        source: data.source ?? KNOWLEDGE_DEFAULTS.DEFAULT_SOURCE,
        sourceUrl: data.sourceUrl,
        metadata: (data.metadata ?? {}) as any,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateKnowledgeData): Promise<Knowledge> {
    await this.ensureOwnership(id, userId);

    return this.prisma.knowledge.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.summary !== undefined && { summary: data.summary }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.source !== undefined && { source: data.source }),
        ...(data.sourceUrl !== undefined && { sourceUrl: data.sourceUrl }),
        ...(data.metadata !== undefined && { metadata: data.metadata as any }),
      },
    });
  }

  async softDelete(id: string, userId: string): Promise<Knowledge> {
    await this.ensureOwnership(id, userId);

    return this.prisma.knowledge.update({
      where: { id },
      data: { deletedAt: new Date() } as any,
    });
  }

  async restore(id: string, userId: string): Promise<Knowledge> {
    const knowledge = await this.prisma.knowledge.findFirst({
      where: { id, userId, deletedAt: { not: null } },
    });

    if (!knowledge) {
      throw new NotFoundException('Deleted knowledge not found');
    }

    return this.prisma.knowledge.update({
      where: { id },
      data: { deletedAt: null } as any,
    });
  }

  async findById(id: string, userId: string): Promise<Knowledge | null> {
    return this.prisma.knowledge.findFirst({
      where: { id, userId, deletedAt: null },
    });
  }

  async search(userId: string, params: SearchKnowledgeParams): Promise<PaginatedResult<Knowledge>> {
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

    if (params.source) {
      where.source = params.source;
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
        { category: { contains: query, mode: 'insensitive' } },
      ] as Record<string, unknown>[];
    }

    const items = await this.prisma.knowledge.findMany({
      where: where as any,
      orderBy: [{ createdAt: 'desc' }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    return this.formatPaginatedResult(items, limit);
  }

  async list(userId: string, params: ListKnowledgeParams): Promise<PaginatedResult<Knowledge>> {
    const limit = this.getLimit(params.limit);
    const cursor = params.cursor;

    const where: Record<string, unknown> = {
      userId,
      deletedAt: null,
    };

    if (params.category) {
      where.category = params.category;
    }

    if (params.source) {
      where.source = params.source;
    }

    const items = await this.prisma.knowledge.findMany({
      where: where as any,
      orderBy: [{ createdAt: 'desc' }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    return this.formatPaginatedResult(items, limit);
  }

  async findRelevant(userId: string, params: FindRelevantParams): Promise<Knowledge[]> {
    const limit = params.limit ?? KNOWLEDGE_DEFAULTS.DEFAULT_LIMIT;
    const query = params.query.trim();

    if (!query) {
      return this.prisma.knowledge.findMany({
        where: { userId, deletedAt: null },
        orderBy: [{ createdAt: 'desc' }],
        take: limit,
      });
    }

    return this.prisma.knowledge.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
      orderBy: [{ createdAt: 'desc' }],
      take: limit,
    });
  }

  private async ensureOwnership(id: string, userId: string): Promise<void> {
    const knowledge = await this.prisma.knowledge.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!knowledge) {
      throw new NotFoundException('Knowledge not found');
    }
  }

  private getLimit(limit?: number): number {
    if (!limit || limit < 1) return KNOWLEDGE_DEFAULTS.DEFAULT_LIMIT;
    return Math.min(limit, KNOWLEDGE_DEFAULTS.MAX_LIMIT);
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
