import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Conversation } from '@prisma/client';
import { IConversationRepository } from '../interfaces/conversation-repository.interface';
import { PaginationParams, PaginatedResult } from '../interfaces/pagination.interface';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { SearchConversationsDto } from '../dto/search-conversations.dto';

@Injectable()
export class ConversationRepository implements IConversationRepository {
  private readonly defaultLimit = 20;
  private readonly maxLimit = 100;

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateConversationDto): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        userId,
        title: dto.title,
        workspaceId: dto.workspaceId,
      },
    });
  }

  async findById(id: string, userId: string): Promise<Conversation | null> {
    return this.prisma.conversation.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  }

  async findAll(userId: string, params: PaginationParams): Promise<PaginatedResult<Conversation>> {
    const limit = this.getLimit(params.limit);
    const cursor = params.cursor;

    const conversations = await this.prisma.conversation.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [{ isPinned: 'desc' }, { lastMessageAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    return this.formatPaginatedResult(conversations, limit);
  }

  async search(userId: string, dto: SearchConversationsDto): Promise<PaginatedResult<Conversation>> {
    const limit = this.getLimit(dto.limit);
    const cursor = dto.cursor;
    const query = dto.q?.trim();

    if (!query) {
      return this.findAll(userId, { limit, cursor });
    }

    const conversations = await this.prisma.conversation.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { lastMessage: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: [{ isPinned: 'desc' }, { lastMessageAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    return this.formatPaginatedResult(conversations, limit);
  }

  async update(id: string, userId: string, dto: UpdateConversationDto): Promise<Conversation> {
    await this.ensureOwnership(id, userId);
    return this.prisma.conversation.update({
      where: { id },
      data: { title: dto.title },
    });
  }

  async archive(id: string, userId: string): Promise<Conversation> {
    await this.ensureOwnership(id, userId);
    return this.prisma.conversation.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async pin(id: string, userId: string): Promise<Conversation> {
    await this.ensureOwnership(id, userId);
    return this.prisma.conversation.update({
      where: { id },
      data: { isPinned: true },
    });
  }

  async unpin(id: string, userId: string): Promise<Conversation> {
    await this.ensureOwnership(id, userId);
    return this.prisma.conversation.update({
      where: { id },
      data: { isPinned: false },
    });
  }

  async softDelete(id: string, userId: string): Promise<Conversation> {
    await this.ensureOwnership(id, userId);
    return this.prisma.conversation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string, userId: string): Promise<Conversation> {
    await this.ensureOwnership(id, userId);
    return this.prisma.conversation.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async findRecent(userId: string, limit?: number): Promise<Conversation[]> {
    const take = limit ?? 10;
    return this.prisma.conversation.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [{ isPinned: 'desc' }, { lastMessageAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
      take,
    });
  }

  private async ensureOwnership(id: string, userId: string): Promise<void> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
  }

  private getLimit(limit?: number): number {
    if (!limit || limit < 1) return this.defaultLimit;
    return Math.min(limit, this.maxLimit);
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
