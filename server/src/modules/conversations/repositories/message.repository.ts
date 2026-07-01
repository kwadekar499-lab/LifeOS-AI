import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Message } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { IMessageRepository } from '../interfaces/message-repository.interface';
import { PaginationParams, PaginatedResult } from '../interfaces/pagination.interface';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageStatusDto } from '../dto/update-message-status.dto';

@Injectable()
export class MessageRepository implements IMessageRepository {
  private readonly defaultLimit = 50;
  private readonly maxLimit = 200;

  constructor(private readonly prisma: PrismaService) {}

  async create(conversationId: string, userId: string, dto: CreateMessageDto): Promise<Message> {
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        userId,
        role: dto.role,
        content: dto.content,
        status: dto.status ?? 'PENDING',
        provider: dto.provider,
        model: dto.model,
        tokenInput: dto.tokenInput,
        tokenOutput: dto.tokenOutput,
        latency: dto.latency,
        attachments: dto.attachments as Prisma.InputJsonValue | undefined,
        toolCalls: dto.toolCalls as Prisma.InputJsonValue | undefined,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    // Update conversation metadata
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: dto.content.substring(0, 200),
        lastMessageAt: new Date(),
      },
    });

    return message;
  }

  async findAll(conversationId: string, params: PaginationParams): Promise<PaginatedResult<Message>> {
    const limit = this.getLimit(params.limit);
    const cursor = params.cursor;

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    return this.formatPaginatedResult(messages, limit);
  }

  async findById(id: string): Promise<Message | null> {
    return this.prisma.message.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async updateStatus(id: string, dto: UpdateMessageStatusDto): Promise<Message> {
    const message = await this.prisma.message.findFirst({
      where: { id, deletedAt: null },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.message.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.tokenOutput !== undefined && { tokenOutput: dto.tokenOutput }),
        ...(dto.latency !== undefined && { latency: dto.latency }),
      },
    });
  }

  async updateMetadata(id: string, metadata: Record<string, unknown>): Promise<Message> {
    const message = await this.prisma.message.findFirst({
      where: { id, deletedAt: null },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const existingMetadata = (message.metadata as Record<string, unknown>) ?? {};

    return this.prisma.message.update({
      where: { id },
      data: {
        metadata: { ...existingMetadata, ...metadata } as Prisma.InputJsonValue,
      },
    });
  }

  async softDelete(id: string): Promise<Message> {
    const message = await this.prisma.message.findFirst({
      where: { id, deletedAt: null },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.message.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async searchMessages(userId: string, query: string, limit?: number): Promise<Message[]> {
    const take = limit ?? 20;
    return this.prisma.message.findMany({
      where: {
        userId,
        deletedAt: null,
        content: { contains: query, mode: 'insensitive' },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  async findRecent(userId: string, limit?: number): Promise<Message[]> {
    const take = limit ?? 20;
    return this.prisma.message.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  async findByConversation(conversationId: string, limit?: number): Promise<Message[]> {
    const take = limit ?? 50;
    return this.prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
      take,
    });
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
