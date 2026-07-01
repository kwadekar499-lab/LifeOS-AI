import { Injectable } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { ConversationRepository } from '../repositories/conversation.repository';
import { MessageRepository } from '../repositories/message.repository';
import { ConversationEventEmitter } from '../events/event-emitter.service';
import { PaginationParams, PaginatedResult } from '../interfaces/pagination.interface';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { SearchConversationsDto } from '../dto/search-conversations.dto';
import { ConversationEventType, ConversationEvent } from '../interfaces/conversation-event.interface';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly eventEmitter: ConversationEventEmitter
  ) {}

  async create(userId: string, dto: CreateConversationDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.create(userId, dto);

    this.emitEvent({
      type: ConversationEventType.CREATED,
      conversationId: conversation.id,
      userId,
      timestamp: new Date(),
      data: { title: dto.title },
    });

    return conversation;
  }

  async findById(id: string, userId: string): Promise<Conversation | null> {
    return this.conversationRepository.findById(id, userId);
  }

  async findAll(userId: string, params: PaginationParams): Promise<PaginatedResult<Conversation>> {
    return this.conversationRepository.findAll(userId, params);
  }

  async search(userId: string, dto: SearchConversationsDto): Promise<PaginatedResult<Conversation>> {
    return this.conversationRepository.search(userId, dto);
  }

  async update(id: string, userId: string, dto: UpdateConversationDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.update(id, userId, dto);

    this.emitEvent({
      type: ConversationEventType.UPDATED,
      conversationId: conversation.id,
      userId,
      timestamp: new Date(),
      data: { title: dto.title },
    });

    return conversation;
  }

  async archive(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.archive(id, userId);

    this.emitEvent({
      type: ConversationEventType.ARCHIVED,
      conversationId: conversation.id,
      userId,
      timestamp: new Date(),
    });

    return conversation;
  }

  async pin(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.pin(id, userId);

    this.emitEvent({
      type: ConversationEventType.PINNED,
      conversationId: conversation.id,
      userId,
      timestamp: new Date(),
    });

    return conversation;
  }

  async unpin(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.unpin(id, userId);

    this.emitEvent({
      type: ConversationEventType.UNPINNED,
      conversationId: conversation.id,
      userId,
      timestamp: new Date(),
    });

    return conversation;
  }

  async softDelete(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.softDelete(id, userId);

    this.emitEvent({
      type: ConversationEventType.DELETED,
      conversationId: conversation.id,
      userId,
      timestamp: new Date(),
    });

    return conversation;
  }

  async restore(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.restore(id, userId);

    this.emitEvent({
      type: ConversationEventType.RESTORED,
      conversationId: conversation.id,
      userId,
      timestamp: new Date(),
    });

    return conversation;
  }

  private emitEvent(event: ConversationEvent): void {
    this.eventEmitter.emit(event);
  }
}
